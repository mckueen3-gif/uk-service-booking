"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * 獲取商戶的社交媒體工具狀態與剩餘額度
 */
export async function getSocialAccountStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "未登入", isPro: false, used: 0, remaining: 0 };
  }

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      isSocialPro: true,
      socialCreditsUsed: true,
      lastSocialReset: true,
    }
  });

  if (!merchant) {
    return { error: "找不到商戶檔案", isPro: false, used: 0, remaining: 0 };
  }

  // 檢查是否需要重置月度額度
  const now = new Date();
  const lastReset = merchant.lastSocialReset || merchant.lastSocialReset === null ? merchant.lastSocialReset : null;
  
  let used = merchant.socialCreditsUsed;
  const isPro = merchant.isSocialPro;
  const limit = isPro ? 60 : 2;

  if (!lastReset || (now.getTime() - new Date(lastReset).getTime() > 30 * 24 * 60 * 60 * 1000)) {
    // 超過 30 天，重置額度
    await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        socialCreditsUsed: 0,
        lastSocialReset: now,
      }
    });
    used = 0;
  }

  return {
    isPro,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    merchantId: merchant.id
  };
}

/**
 * 增加使用次數（扣除額度）
 */
export async function incrementSocialUsage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "未登入" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { success: false, error: "商戶不存在" };

  const isPro = merchant.isSocialPro;
  const limit = isPro ? 39 : 2;

  if (merchant.socialCreditsUsed >= limit) {
    return { success: false, error: "額度已達上限" };
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      socialCreditsUsed: { increment: 1 }
    }
  });

  revalidatePath("/merchant/toolkit/social");
  return { success: true };
}

/**
 * 模擬升級到專業版
 */
export async function upgradeToPro() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "未登入" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { success: false, error: "商戶不存在" };

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      isSocialPro: true,
      socialCreditsUsed: 0, // 升級時贈送重置
      lastSocialReset: new Date(),
    }
  });

  revalidatePath("/merchant/toolkit/social");
  return { success: true };
}
