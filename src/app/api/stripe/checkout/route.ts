import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripe = await getStripeClient();
    const body = await req.json();
    const { merchantId, serviceId, serviceName, basePriceStr, scheduledDate, vehicleInfo } = body;
    
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!merchantId || !serviceName || !basePriceStr) {
        return NextResponse.json({ error: 'Missing booking parameters' }, { status: 400 });
    }

    // Clean price string, e.g. "£54" -> 54
    const priceAmount = parseInt(basePriceStr.replace(/[^0-9]/g, ''), 10);
    const amountInPence = priceAmount * 100;
    
    // 12% platform fee (ServiceHub Commission)
    const applicationFeeInPence = Math.round(amountInPence * 0.12);

    // Developer Bypass: If they clicked the Mock "LondonFix" dummy UI card, 
    // automatically find YOUR real onboarded merchant account and route the money there!
    let targetMerchantId = merchantId;
    if (merchantId === 'merchant_demo_123' || merchantId === 'undefined' || merchantId === undefined) {
      const onboarded = await prisma.merchant.findFirst({ 
        where: { stripeAccountId: { not: null } }
      });
      if (onboarded) targetMerchantId = onboarded.userId;
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: targetMerchantId }
    });

    if (!merchant || !merchant.stripeAccountId) {
      return NextResponse.json({ error: 'Merchant is not fully onboarded with Stripe to receive payments.' }, { status: 400 });
    }

    let checkoutSession;
    
    try {
      // Create a Stripe Checkout session enforcing the Destination Charge split
      checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: amountInPence,
              product_data: {
                name: `${serviceName} - Booking Deposit`,
                description: `Professional Service Booking with ${merchant.companyName}`
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: applicationFeeInPence,
          transfer_data: {
            destination: merchant.stripeAccountId,
          },
          metadata: {
            merchantId,
            customerId: session.user.id,
            scheduledDate: scheduledDate || new Date().toISOString(),
            serviceId,
            serviceName,
            vehicleInfo: JSON.stringify(vehicleInfo || {})
          }
        },
        success_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?canceled=true`,
      });
    } catch (stripeErr: any) {
      // Sandbox Fallback: If sandbox account misses 'transfers' capability due to skipped onboarding form
      if (stripeErr.message && stripeErr.message.includes('stripe_balance.stripe_transfers')) {
        console.warn('Sandbox Bypass: Degrading to direct platform charge. Destination account lacks transfers capability.');
        checkoutSession = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'gbp',
                unit_amount: amountInPence,
                product_data: {
                  name: `${serviceName} (Sandbox Fallback)`,
                  description: `Test Mode: Platform Charge Bypass for ${merchant.companyName}`
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?success=true&service=${encodeURIComponent(serviceName)}&price=${encodeURIComponent(basePriceStr)}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?canceled=true`,
        });
      } else {
        throw stripeErr;
      }
    }

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
