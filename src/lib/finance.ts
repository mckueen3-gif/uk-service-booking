import { prisma } from './prisma';
import { getCommissionRate } from './commission';
import { getStripeClient } from './stripe';
import { Booking } from '@prisma/client';

/**
 * Calculates the platform commission based on the merchant's settings.
 */
export async function calculateCommission(merchantId: string, amount: number) {
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { 
      id: true,
      commissionRate: true
    }
  });

  if (!merchant) return { platformFee: 0, merchantPayout: amount, rate: 0 };

  const rate = getCommissionRate(merchant);
  const platformFee = amount * rate;
  const merchantPayout = amount - platformFee;

  return { 
    platformFee, 
    merchantPayout, 
    rate: rate * 100 // as percentage
  };
}

/**
 * Updates the merchant wallet with new earnings (e.g. at booking creation or variation approval).
 * For variations, isPending is typically true until the entire job is completed.
 */
export async function updateMerchantWallet(merchantId: string, amount: number, isPending: boolean = false) {
  const { merchantPayout } = await calculateCommission(merchantId, amount);

  return await prisma.merchantWallet.upsert({
    where: { merchantId },
    update: {
      totalEarned: isPending ? undefined : { increment: merchantPayout },
      availableBalance: isPending ? undefined : { increment: merchantPayout },
      pendingBalance: isPending ? { increment: amount } : undefined
    },
    create: {
      merchantId,
      totalEarned: isPending ? 0 : merchantPayout,
      availableBalance: isPending ? 0 : merchantPayout,
      pendingBalance: isPending ? amount : 0
    }
  });
}

/**
 * Moves funds from pending (escrow) to available balance, applying the current commission rate.
 * This is used for simple/full payments (like Education after 14 days).
 */
export async function movePendingToAvailable(merchantId: string, netAmount: number) {
  return await prisma.merchantWallet.update({
    where: { merchantId },
    data: {
      pendingBalance: { decrement: netAmount },
      availableBalance: { increment: netAmount }
    }
  });
}

/**
 * Handles the final fund movement when a booking is COMPLETED.
 * For Repairs: Captures the 80% hold and releases both deposit + balance.
 * For Education: Does nothing (funds stay pending until 14-day cooling-off expires).
 */
export async function completeBookingFunds(booking: Booking & { isEducation?: boolean; stripeBalanceIntentId?: string | null; depositPaid: number; balanceAmount?: number | null }) {
  // If Education, funds stay pending for the 14-day legal cooling-off period.
  if (booking.isEducation) {
    return { success: true, message: "Education funds stay pending for 14-day cooling-off." };
  }

  // Repairs Sector: Finalize the 80% Balance
  if (booking.stripeBalanceIntentId && booking.status !== 'COMPLETED') {
    try {
      const stripe = await getStripeClient();
      await stripe.paymentIntents.capture(booking.stripeBalanceIntentId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Finance] Stripe Capture Failed for Booking ${booking.id}:`, message);
      throw new Error(`Failed to capture balance: ${message}`);
    }
  }

  // Fund Movement for Repairs:
  // 1. Net Deposit (commission applied) is in Pending.
  // 2. Net Balance (commission applied) is in Authorized.
  const { merchantPayout: netDeposit } = await calculateCommission(booking.merchantId, booking.depositPaid);
  const { merchantPayout: netBalance } = await calculateCommission(booking.merchantId, booking.balanceAmount || 0);

  // Perform Atomic Wallet Update
  return await prisma.merchantWallet.update({
    where: { merchantId: booking.merchantId },
    data: {
      pendingBalance: { decrement: netDeposit },
      authorizedBalance: { decrement: netBalance },
      availableBalance: { increment: netDeposit + netBalance },
      totalEarned: { increment: netBalance } 
    }
  });
}

/**
 * Standardized logic for recording the first payment (deposit) when a booking is created.
 * Ensures the merchant's pending balance is correctly credited.
 */
export async function recordInitialBookingPayment(merchantId: string, depositAmount: number) {
  const { merchantPayout, platformFee } = await calculateCommission(merchantId, depositAmount);

  await prisma.merchantWallet.upsert({
    where: { merchantId },
    update: {
      pendingBalance: { increment: merchantPayout },
      totalEarned: { increment: merchantPayout }
    },
    create: {
      merchantId,
      pendingBalance: merchantPayout,
      totalEarned: merchantPayout
    }
  });

  return { merchantPayout, platformFee };
}
