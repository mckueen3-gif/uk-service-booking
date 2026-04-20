"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';
import { getMerchantId } from '@/lib/merchant-utils';

export async function getEarningsStats() {
  const session = (await getServerSession(authOptions)) as any;
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant profile not found" };

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: { 
      wallet: true,
      user: {
        select: {
          id: true,
          referralCode: true,
          referralCredits: true
        }
      }
    }
  });

  if (!merchant) return { error: "Merchant profile not found" };

  // Count active referrals
  const referralCount = await prisma.referral.count({
    where: { referrerId: session.user.id }
  });

  // Recent referrals (optional, for the hub)
  const recentReferrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: { referee: { select: { name: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Recent transactions (bookings)
  const recentBookings = await prisma.booking.findMany({
    where: { merchantId: merchant.id, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { service: true }
  });

  // Recent withdrawals
  const recentWithdrawals = await (prisma as any).withdrawalRequest.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return {
    wallet: merchant.wallet,
    recentBookings,
    recentWithdrawals,
    merchant,
    user: merchant.user,
    referralCount,
    recentReferrals
  };
}

export async function requestWithdrawal(amount: number) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant profile not found" };

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: { wallet: true }
  });

  if (!merchant || !merchant.wallet) return { error: "Wallet not found" };

  const decimalAvailable = Number(((merchant.wallet as any).availableBalance || 0).toFixed(2));
  
  if (amount < 10) {
    return { error: "最低提領金額為 £10.00 (Minimum withdrawal £10.00)" };
  }

  if (amount > decimalAvailable) {
    return { error: "提領金額超過可用餘額 (Insufficient balance)" };
  }

  // Create Withdrawal Request
  await (prisma as any).withdrawalRequest.create({
    data: {
      merchantId: merchant.id,
      amount: amount,
      status: 'PENDING'
    }
  });

  // Deduct from availableBalance
  await (prisma as any).merchantWallet.update({
    where: { merchantId: merchant.id },
    data: {
      availableBalance: { decrement: amount } as any
    }
  });

  revalidatePath('/dashboard/earnings');
  return { success: true };
}

export async function updateBankDetails(sortCode: string, accountNumber: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant profile not found" };

  await (prisma as any).merchant.update({
    where: { id: merchantId },
    data: {
      bankSortCode: sortCode,
      bankAccountNumber: accountNumber
    }
  });

  revalidatePath('/dashboard/earnings/payout');
  return { success: true };
}

export async function getMerchantReceipts() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant) return { error: "Merchant not found" };

  return await prisma.receipt.findMany({
    where: {
      booking: {
        merchantId: merchant.id
      }
    },
    include: {
      booking: {
        include: {
          customer: { select: { name: true, email: true } },
          service: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}
