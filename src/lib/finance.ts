import { prisma } from './prisma';
import { getCommissionRate } from './commission';

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
