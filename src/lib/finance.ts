"use server";

import { prisma } from './prisma';

/**
 * Calculates the platform commission based on the merchant's job history.
 * Tiers:
 * 0-3 Completed Jobs: 0%
 * 4-10 Completed Jobs: 5%
 * 11+ Completed Jobs: 12%
 */
export async function calculateCommission(merchantId: string, amount: number) {
  const merchant = await (prisma.merchant as any).findUnique({
    where: { id: merchantId },
    select: { completedJobsCount: true }
  });

  if (!merchant) return { platformFee: 0, merchantPayout: amount, rate: 0 };

  const jobs = merchant.completedJobsCount || 0;
  let rate = 0.12; // Default 12%

  if (jobs <= 3) {
    rate = 0;
  } else if (jobs <= 10) {
    rate = 0.05;
  }

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

  return await (prisma as any).merchantWallet.upsert({
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
 * This is called when a booking is officially COMPLETED.
 */
export async function movePendingToAvailable(merchantId: string, grossAmount: number) {
  const { merchantPayout } = await calculateCommission(merchantId, grossAmount);

  return await (prisma as any).merchantWallet.update({
    where: { merchantId },
    data: {
      pendingBalance: { decrement: grossAmount },
      availableBalance: { increment: merchantPayout },
      totalEarned: { increment: merchantPayout }
    }
  });
}
