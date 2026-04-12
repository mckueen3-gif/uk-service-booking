import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';

// Stripe Webhook handler for robust background event listening
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripe = await getStripeClient();
    let event;

    if (webhookSecret) {
      // ✅ Production Security: Cryptographically verify the signature
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`[Webhook Security Failure] Signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
      }
    } else {
      // ⚠️ Warning: Missing webhook secret. Defaulting to insecure parsing for development.
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET is missing. Bypassing signature verification (Insecure).');
      try {
        event = JSON.parse(body);
      } catch (err: any) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    }

    switch (event.type) {
      
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata;
        const customerId = session.customer;
        const paymentIntentId = session.payment_intent as string;

        if (!metadata) break;

        // Idempotency: Check if this payment was already processed
        const existingBooking = await prisma.booking.findUnique({
          where: { stripePaymentIntentId: paymentIntentId }
        });
        if (existingBooking) {
          console.log(`[Webhook] Duplicate event ignored for intent: ${paymentIntentId}`);
          break;
        }

        const {
          merchantId,
          customerId: userId,
          serviceId,
          serviceName,
          isEducation,
          subscription_type,
          totalAmount: totalStr,
          depositAmount: depositStr,
          balanceAmount: balanceStr,
          scheduledDate
        } = metadata;

        // --- NEW: Accounting Subscription Logic ---
        if (subscription_type === 'accounting_premium') {
          console.log(`[Stripe Webhook] 💎 Activating Premium Accounting for Merchant: ${merchantId}`);
          await prisma.merchant.update({
            where: { id: merchantId },
            data: { isAccountingActive: true }
          });
          return NextResponse.json({ received: true });
        }

        const totalAmount = parseFloat(totalStr || "0") / 100;
        const depositAmount = parseFloat(depositStr || "0") / 100;
        const balanceAmount = parseFloat(balanceStr || "0") / 100;
        const isEduBool = isEducation === 'true';

        // 1. Update User with Stripe Customer ID for future holds
        if (userId && customerId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId as string }
          });
        }

        // 2. Create the Booking with sectoral logic
        const coolingOffDays = isEduBool ? 14 : 0;
        const coolingOffUntil = isEduBool 
          ? new Date(Date.now() + coolingOffDays * 24 * 60 * 60 * 1000) 
          : null;

        const booking = await prisma.booking.create({
          data: {
            customerId: userId,
            merchantId,
            serviceId,
            scheduledDate: new Date(scheduledDate),
            status: 'PENDING',
            totalAmount,
            depositPaid: depositAmount,
            balanceAmount,
            isEducation: isEduBool,
            coolingOffUntil,
            stripePaymentIntentId: paymentIntentId,
            platformFee: depositAmount * 0.09, // 9% fee on what was just captured
            merchantAmount: depositAmount * 0.91,
          }
        });

        // 3. Update Merchant Wallet (Pending)
        const { recordInitialBookingPayment } = await import('@/lib/finance');
        await recordInitialBookingPayment(merchantId, depositAmount);

        console.log(`[Stripe Webhook] 📦 Booking ${booking.id} created. Sector: ${isEduBool ? 'Education' : 'Repairs'}. Deposit: £${depositAmount}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (err: any) {
    console.error(`[Webhook Error] Critical Failure: ${err.message}`);
    return NextResponse.json({ error: `Internal Webhook Error: ${err.message}` }, { status: 500 });
  }
}
