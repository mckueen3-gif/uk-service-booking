"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const session = (await getServerSession(authOptions)) as any;
  return session?.user?.id;
}

export async function getWalletStats() {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      referralCredits: true, 
      referralCode: true,
      creditTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    } as any
  });

  return { stats: user };
}

export async function redeemVoucher(code: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the voucher
      const voucher = await (tx as any).voucher.findUnique({
        where: { code }
      });

      if (!voucher) throw new Error("無效的代碼 (Invalid Code)");
      if (voucher.isRedeemed) throw new Error("此代碼已被使用 (Already redeemed)");
      if (voucher.expiryDate && new Date() > voucher.expiryDate) throw new Error("代碼已過期 (Expired)");

      // 2. Mark as redeemed
      await (tx as any).voucher.update({
        where: { id: voucher.id },
        data: { 
          isRedeemed: true, 
          redeemedBy: userId 
        }
      });

      // 3. Add credits to user
      await tx.user.update({
        where: { id: userId },
        data: { 
          referralCredits: { increment: voucher.value } 
        }
      });

      // 4. Create transaction log
      await (tx as any).creditTransaction.create({
        data: {
          userId,
          amount: voucher.value,
          type: 'VOUCHER_REDEEM',
          description: `Voucher Redemption: ${code}`
        }
      });

      return { success: true, value: voucher.value };
    });

    revalidatePath('/dashboard/wallet');
    return result;
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function ensureReferralCode() {
  const userId = await getUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true }
  });

  if (!user?.referralCode) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await (prisma.user.update as any)({
      where: { id: userId },
      data: { referralCode: code }
    });
    return code;
  }

  return user.referralCode;
}
