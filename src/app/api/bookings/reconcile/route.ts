import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

/**
 * API for Booking Reconciliation (Automated Refund on Price Decrease)
 * This is triggered when a merchant submits a final invoice that is LOWER than the escrow deposit.
 */
export async function POST(
  req: Request
) {
  try {
    const { finalPrice, escrowAmount, paymentIntentId, bookingId } = await req.json();

    if (finalPrice >= escrowAmount) {
      return NextResponse.json({ 
        success: true, 
        message: 'No refund needed. Capturing full amount.' 
      });
    }

    const refundAmount = (escrowAmount - finalPrice) * 100; // Convert to cents

    // 1. Trigger Stripe Partial Refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
      reason: 'requested_by_customer', // Dynamic price adjustment
      metadata: {
        bookingId: bookingId,
        type: 'automotive_price_adjustment'
      }
    });

    // 2. Log Internal Financial Reconcile
    console.log(`[Finance] Booking ${bookingId} reconciled. Original: £${escrowAmount}, Final: £${finalPrice}, Refunded: £${refundAmount/100}`);

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      finalPayment: finalPrice,
      refundedAmount: refundAmount / 100,
      message: `Automated refund of £${refundAmount / 100} processed successfully.`
    });

  } catch (error: any) {
    console.error('[Reconcile Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
