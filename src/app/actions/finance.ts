"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function getEarningsStats() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id },
    include: { wallet: true }
  });

  if (!merchant) return { error: "Merchant profile not found" };

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
    merchant
  };
}

export async function requestWithdrawal(amount: number) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id },
    include: { wallet: true }
  });

  if (!merchant || !merchant.wallet) return { error: "Wallet not found" };

  const decimalAvailable = Number(merchant.wallet.availableBalance.toFixed(2));
  
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
      availableBalance: { decrement: amount }
    }
  });

  revalidatePath('/dashboard/earnings');
  return { success: true };
}

export async function updateBankDetails(sortCode: string, accountNumber: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  await (prisma as any).merchant.update({
    where: { userId: session.user.id },
    data: {
      bankSortCode: sortCode,
      bankAccountNumber: accountNumber
    }
  });

  revalidatePath('/dashboard/earnings/payout');
  return { success: true };
}
