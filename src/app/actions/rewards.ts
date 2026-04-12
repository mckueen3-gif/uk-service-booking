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
    console.error("Rewards Action: Session check failed:", err);
    return null;
  }
}

/**
 * 用戶申請兌換現金券
 */
export async function requestRedemption(amount: number, brandName: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" };

  if (amount < 10) {
    return { error: "最低兌換金額為 £10 (Minimum £10 to redeem)" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 檢查用戶點數
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { referralCredits: true }
      });

      if (!user || user.referralCredits < amount) {
        throw new Error("點數不足 (Insufficient Credits)");
      }

      // 2. 建立兌換申請
      // @ts-ignore
      const request = await tx.redemptionRequest.create({
        data: {
          userId,
          amount,
          brandName,
          status: "PENDING"
        }
      });

      // 3. 扣除用戶點數
      await tx.user.update({
        where: { id: userId },
        data: { 
          referralCredits: { decrement: amount } 
        }
      });

      // 4. 建立交易日誌
      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          // @ts-ignore
          type: 'REDEMPTION_VOUCHER' as any,
          description: `申請兌換 ${brandName || '現金券'}: £${amount.toFixed(2)} (處理中)`
        }
      });

      return { success: true, requestId: request.id };
    });

    revalidatePath('/dashboard/wallet');
    return result;
  } catch (err: any) {
    console.error("Redemption Request Error:", err);
    return { error: err.message };
  }
}

/**
 * 獲取用戶的兌換紀錄
 */
export async function getMyRedemptions() {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated", requests: [] };

  try {
    // @ts-ignore
    const requests = await prisma.redemptionRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, requests };
  } catch (err: any) {
    return { error: err.message, requests: [] };
  }
}

/**
 * 管理員核發代碼 (Fulfill)
 * 注意：實際生產中應有 Role.ADMIN 檢查，此處實作核心邏輯
 */
export async function fulfillRedemption(requestId: string, voucherCode: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" };

  // TODO: Add Admin Role Check logic here if needed
  
  try {
    // @ts-ignore
    await prisma.redemptionRequest.update({
      where: { id: requestId },
      data: {
        status: "COMPLETED",
        voucherCode,
        issuedAt: new Date()
      }
    });

    revalidatePath('/dashboard/wallet');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * 🎯 觸發 AI 禮券清單同步 (Admin Only)
 */
export async function runVoucherSync() {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated" };

  // TODO: Add strict Admin Role logic if this goes to production
  
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    console.log("🚀 Starting manual AI Voucher Sync...");
    await execAsync('npm run sync-vouchers');
    
    revalidatePath('/dashboard/wallet');
    return { success: true, message: "Sync completed successfully" };
  } catch (err: any) {
    console.error("Voucher Sync Error:", err);
    return { error: "Sync failed: " + err.message };
  }
}
