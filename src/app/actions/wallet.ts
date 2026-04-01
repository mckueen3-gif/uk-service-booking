"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getUserId() {
  try {
    const session = (await getServerSession(authOptions).catch(() => null)) as any;
    return session?.user?.id;
  } catch (err) {
    console.error("Wallet Action: Session check failed:", err);
    return null;
  }
}

export async function getWalletStats() {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Not authenticated" };

    // Explicit selection to bypass missing referralCode/referralCredits in prod DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true,
        // referralCredits: true, // Temporarily disabled for schema sync
        // referralCode: true,    // Temporarily disabled for schema sync
        creditTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      } as any
    });

    if (!user) {
      return { 
        stats: { referralCredits: 0, referralCode: null, creditTransactions: [] } 
      };
    }

    return { 
      stats: {
        ...user,
        referralCredits: user.referralCredits || 0,
        creditTransactions: user.creditTransactions || []
      } 
    };
  } catch (err: any) {
    console.error("Wallet stats fetch error:", err);
    const isConnError = err.message?.includes('max clients') || err.message?.includes('pool');
    return { 
      error: isConnError ? "系統連線繁忙，請稍微重新整理" : "暫時無法獲取錢包數據",
      stats: { referralCredits: 0, referralCode: null, creditTransactions: [] } 
    };
  }
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
  try {
    const userId = await getUserId();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true } // Avoid referralCode here
    }) as any;

    // To be 100% safe, we return "N/A" if the feature is currently disabled
    return user?.referralCode || "Service Unavailable";
  } catch (err) {
    console.error("ensureReferralCode failed (missing column?)", err);
    return "Service Unavailable";
  }
}
