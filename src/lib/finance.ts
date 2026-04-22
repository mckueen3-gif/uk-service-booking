import { prisma } from './prisma';
import { getCommissionRate } from './commission';
import { getStripeClient } from './stripe';
import { Booking } from '@prisma/client';

/**
 * Calculates the platform commission based on the merchant's settings.
 */
export async function calculateCommission(merchantId: string, amount: number, customerId?: string) {
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { 
      id: true,
      commissionRate: true
    }
  });

  if (!merchant) return { platformFee: 0, merchantPayout: amount, rate: 0.10, referralDividend: 0, referrerId: null };

  const { calculateCommissionSplit } = await import('./commission');
  
  let split;
  if (customerId) {
    split = await calculateCommissionSplit(customerId, amount);
  } else {
    // Fallback if customerId not provided (e.g. general quoting)
    split = { platformFee: amount * 0.10, referralDividend: 0, referrerId: null };
  }

  const merchantPayout = amount - (split.platformFee + split.referralDividend);

  return { 
    platformFee: split.platformFee, 
    merchantPayout, 
    referralDividend: split.referralDividend,
    referrerId: split.referrerId,
    rate: 0.10 // Base rate for UI display if needed
  };
}

/**
 * Updates the merchant wallet with new earnings (e.g. at booking creation or variation approval).
 * For variations, isPending is typically true until the entire job is completed.
 */
export async function updateMerchantWallet(merchantId: string, amount: number, isPending: boolean = false, customerId?: string) {
  const { merchantPayout, referralDividend, referrerId } = await calculateCommission(merchantId, amount, customerId);

  // If there's a referral dividend, credit the referrer immediately or track it
  if (referralDividend > 0 && referrerId) {
    await prisma.user.update({
      where: { id: referrerId },
      data: { referralCredits: { increment: referralDividend } as any }
    });
    
    // Also update the referral record for history
    await prisma.referral.update({
      where: { refereeId: customerId! },
      data: { earnedFromReferee: { increment: referralDividend } as any }
    });
  }

  return await prisma.merchantWallet.upsert({
    where: { merchantId },
    update: {
      totalEarned: isPending ? undefined : { increment: merchantPayout } as any,
      availableBalance: isPending ? undefined : { increment: merchantPayout } as any,
      pendingBalance: isPending ? { increment: amount } as any : undefined
    },
    create: {
      merchantId,
      totalEarned: (isPending ? 0 : merchantPayout) as any,
      availableBalance: (isPending ? 0 : merchantPayout) as any,
      pendingBalance: (isPending ? amount : 0) as any
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
      pendingBalance: { decrement: netAmount } as any,
      availableBalance: { increment: netAmount } as any
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
  const { merchantPayout: netDeposit } = await calculateCommission(booking.merchantId, booking.depositPaid, booking.customerId);
  const { merchantPayout: netBalance } = await calculateCommission(booking.merchantId, booking.balanceAmount || 0, booking.customerId);

  // Perform Atomic Wallet Update
  const update = await prisma.merchantWallet.update({
    where: { merchantId: booking.merchantId },
    data: {
      pendingBalance: { decrement: netDeposit } as any,
      authorizedBalance: { decrement: netBalance } as any,
      availableBalance: { increment: netDeposit + netBalance } as any,
      totalEarned: { increment: netBalance } as any
    }
  });

  // 🚀 AUTOMATED RECEIPT GENERATION
  const { generateAndSaveReceipt } = await import('@/app/actions/receipts');
  await generateAndSaveReceipt(booking.id);

  return update;
}

/**
 * Standardized logic for recording the first payment (deposit) when a booking is created.
 * Ensures the merchant's pending balance is correctly credited.
 */
export async function recordInitialBookingPayment(merchantId: string, depositAmount: number, customerId?: string) {
  const { merchantPayout, platformFee, referralDividend, referrerId } = await calculateCommission(merchantId, depositAmount, customerId);

  // Handle Dividends
  if (referralDividend > 0 && referrerId) {
    await prisma.user.update({
      where: { id: referrerId },
      data: { referralCredits: { increment: referralDividend } as any }
    });
    
    await prisma.referral.update({
      where: { refereeId: customerId! },
      data: { earnedFromReferee: { increment: referralDividend } as any }
    });
  }

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

  return { merchantPayout, platformFee, referralDividend };
}
