import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { calculateNetPayout } from '@/lib/commission';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripe = await getStripeClient();
    const body = await req.json();
    const { merchantId, serviceId, serviceName, basePriceStr, scheduledDate, vehicleInfo, isUrgent } = body;
    
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!merchantId || !serviceName || !basePriceStr) {
        return NextResponse.json({ error: 'Missing booking parameters' }, { status: 400 });
    }

    // Clean price string, e.g. "£54" -> 54
    const priceAmount = parseFloat(basePriceStr.replace(/[^0-9.]/g, ''));
    
    // (Developer Bypass logic...)
    let targetMerchantId = merchantId;
    if (merchantId === 'merchant_demo_123' || merchantId === 'undefined' || !merchantId) {
      const onboarded = await prisma.merchant.findFirst({ 
        where: { stripeAccountId: { not: null } }
      });
      if (onboarded) targetMerchantId = onboarded.id;
    }

    const merchant = await prisma.merchant.findUnique({
      where: { id: targetMerchantId }
    });

    if (!merchant || !merchant.stripeAccountId) {
      return NextResponse.json({ error: 'Merchant is not fully onboarded with Stripe to receive payments.' }, { status: 400 });
    }

    // Fetch service to determine sector (Education vs Repairs)
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    const isEducation = service?.category === 'Education';
    
    // 🛡️ UNIFIED COMMISSION LOGIC
    // This ensures Education is MARKUP (+9%) and others are DEDUCTION (-9%)
    const { totalCustomerPayment, platformFee } = calculateNetPayout(priceAmount, merchant, isEducation);

    const totalCustomerPaysInPence = Math.round(totalCustomerPayment * 100);
    const totalPlatformFeeInPence = Math.round(platformFee * 100);

    // Calculate Sector-Specific Logic
    // Education: 100% upfront
    // Others: 20% deposit, save card for 80% balance
    const checkoutAmountInPence = isEducation ? totalCustomerPaysInPence : Math.round(totalCustomerPaysInPence * 0.20);
    const balanceAmountInPence = totalCustomerPaysInPence - checkoutAmountInPence;
    
    // Pro-rata application fee for deposit vs full
    const checkoutFeeInPence = isEducation ? totalPlatformFeeInPence : Math.round(totalPlatformFeeInPence * 0.20);

    let checkoutSession;
    
    try {
      // Create a Stripe Checkout session enforcing the Destination Charge split
      checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: session.user.email,
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: checkoutAmountInPence,
              product_data: {
                name: isEducation ? `${serviceName} (Full Payment)` : `${serviceName} (20% Deposit)`,
                description: isEducation 
                  ? `Course full payment with ${merchant.companyName}` 
                  : `Secure your booking with ${merchant.companyName} (20% Deposit)`
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: checkoutFeeInPence,
          transfer_data: {
            destination: merchant.stripeAccountId,
          },
          // For Repairs, save the card for the 80% balance hold later
          setup_future_usage: isEducation ? undefined : 'off_session',
          metadata: {
            merchantId,
            customerId: session.user.id,
            scheduledDate: scheduledDate || new Date().toISOString(),
            serviceId,
            serviceName,
            isEducation: isEducation ? 'true' : 'false',
            isUrgent: isUrgent ? 'true' : 'false',
            totalAmount: totalCustomerPaysInPence.toString(),
            depositAmount: checkoutAmountInPence.toString(),
            balanceAmount: balanceAmountInPence.toString(),
            vehicleInfo: JSON.stringify(vehicleInfo || {})
          }
        },
        success_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/book/${merchantId}?canceled=true`,
      });
    } catch (stripeErr: any) {
      console.error("Stripe Checkout Error:", stripeErr);
      throw stripeErr;
    }

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
