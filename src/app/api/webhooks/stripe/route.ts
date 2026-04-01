import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Stripe Webhook handler for robust background event listening
// This bypasses browser closures and ensures Payment/Escrow states are always 100% accurate.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  try {
    // In production, we'd cryptographicly verify the Stripe signature:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    
    // Simulating parsing the event for demonstration
    const event = JSON.parse(body);

    switch (event.type) {
      
      case 'checkout.session.completed': {
        const session = event.data.object;
        const metadata = session.metadata;
        const customerId = session.customer;
        const paymentIntentId = session.payment_intent;

        if (!metadata) break;

        const {
          merchantId,
          customerId: userId,
          serviceId,
          serviceName,
          isEducation,
          totalAmount: totalStr,
          depositAmount: depositStr,
          balanceAmount: balanceStr,
          scheduledDate
        } = metadata;

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
            stripePaymentIntentId: paymentIntentId as string,
            platformFee: depositAmount * 0.09, // 9% fee on what was just captured
            merchantAmount: depositAmount * 0.91,
          }
        });

        // 3. Update Merchant Wallet (Pending)
        // 91% of what was captured goes to merchant's pending balance
        await prisma.merchantWallet.upsert({
          where: { merchantId },
          update: {
            pendingBalance: { increment: depositAmount * 0.91 },
            totalEarned: { increment: depositAmount * 0.91 }
          },
          create: {
            merchantId,
            pendingBalance: depositAmount * 0.91,
            totalEarned: depositAmount * 0.91
          }
        });

        console.log(`[Stripe Webhook] 📦 Booking ${booking.id} created. Sector: ${isEduBool ? 'Education' : 'Repairs'}. Deposit: £${depositAmount}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt to prevent Stripe from resending Webhooks
    return NextResponse.json({ received: true });
    
  } catch (err: any) {
    console.error(`[Webhook Error] Parsing Failed: ${err.message}`);
    // Respond with 400 so Stripe knows we failed and retry protocol begins
    return NextResponse.json({ error: `Webhook Signature/Parsing Error: ${err.message}` }, { status: 400 });
  }
}
