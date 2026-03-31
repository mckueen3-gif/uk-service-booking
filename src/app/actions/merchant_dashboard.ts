"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getMerchantId() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return null;
  
  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });
  return merchant?.id;
}

export async function getMerchantDashboardStats() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  const stats = await prisma.booking.aggregate({
    where: { merchantId },
    _count: { id: true },
    _sum: { totalAmount: true }
  });

  const wallet = await prisma.merchantWallet.findUnique({
    where: { merchantId }
  });

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { averageRating: true, totalReviews: true, companyName: true }
  });

  return {
    totalBookings: stats._count.id || 0,
    totalVolume: stats._sum.totalAmount || 0,
    availableBalance: wallet?.availableBalance || 0,
    pendingBalance: wallet?.pendingBalance || 0,
    rating: merchant?.averageRating || 0,
    reviews: merchant?.totalReviews || 0,
    companyName: merchant?.companyName
  };
}

export async function getMerchantBookings() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  const bookings = await prisma.booking.findMany({
    where: { merchantId },
    include: {
      customer: { select: { name: true, image: true, phone: true } },
      service: { select: { name: true, category: true } },
      variations: true,
      dispute: true
    },
    orderBy: { scheduledDate: 'desc' }
  });

  return { bookings };
}

import { movePendingToAvailable } from '@/lib/finance';

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId, merchantId },
      data: { status: newStatus as any }
    });

    // If completed, move funds from pending to available (Standardized Tiered Commission)
    if (newStatus === 'COMPLETED') {
      await movePendingToAvailable(merchantId, (booking as any).totalAmount);
      
      // 3. Referral Reward Logic (Passive Income: 2% of each order)
      try {
        const referral = await prisma.referral.findUnique({
          where: { refereeId: (booking as any).customerId }
        });

        if (referral && referral.referrerId) {
          // Check for 5-year expiration
          const fiveYearsAgo = new Date();
          fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
          const isExpired = referral.createdAt < fiveYearsAgo;

          // Check if earning cap (£200) has been reached
          const currentTotal = referral.earnedFromReferee || 0;
          const isCapped = currentTotal >= 200;

          if (!isExpired && !isCapped) {
            const potentialReward = (booking as any).totalAmount * 0.02; // New 2% Reward
            // Ensure next reward doesn't exceed the total cap of £200 per referee
            const rewardAmount = Math.min(potentialReward, 200 - currentTotal);

            if (rewardAmount > 0) {
              await prisma.$transaction([
                // Update referrer balance
                prisma.user.update({
                  where: { id: referral.referrerId },
                  data: { referralCredits: { increment: rewardAmount } }
                }),
                // Update referral record tracking
                (prisma.referral as any).update({
                  where: { id: referral.id },
                  data: { 
                    earnedFromReferee: { increment: rewardAmount },
                    status: 'COMPLETED' // Mark as completed (active referral relationship)
                  }
                }),
                // Log transaction
                (prisma as any).creditTransaction.create({
                  data: {
                    userId: referral.referrerId,
                    amount: rewardAmount,
                    type: 'EARNED_REFERRAL',
                    description: `2% Referral Passive Income from Booking: ${booking.id}`
                  }
                })
              ]);
              console.log(`Issued ${rewardAmount} passive credits to referrer ${referral.referrerId}`);
            }
          } else if (isCapped || isExpired) {
             console.log(`Referral reward skipped: ${isCapped ? "Capped at £200" : "Expired (5 Years passed)"}`);
          }
        }
      } catch (refErr) {
        console.error("Referral reward error:", refErr);
      }
    }

    // 4. Send Completion Notification
    await createNotification({
      userId: (booking as any).customerId,
      title: "🎉 服務已完成",
      message: `您向 ${merchantId} 預約的服務已標記為完成。感謝您的使用！`,
      type: 'SUCCESS',
      link: `/dashboard`
    });

    return { success: true, booking };
  } catch (err: any) {
    console.error("Update Status Error:", err);
    return { error: err.message };
  }
}

/**
 * Rejects a variation (Customer side action, but placed here for dashboard consolidation).
 */
export async function rejectVariation(variationId: string, reason: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const variation = await (prisma as any).variation.update({
    where: { id: variationId },
    data: { status: 'REJECTED' },
    include: { booking: { include: { merchant: true } } }
  });

  // Automatically open a dispute record
  if (variation) {
    const { openDispute } = await import('./dispute');
    await openDispute(variation.bookingId, `客戶拒絕金額變更: ${reason}`);

    // Notify merchant about the rejection
    await createNotification({
      userId: variation.booking.merchant.userId,
      title: "⚠️ 金額變更被拒絕",
      message: `客戶已拒絕預約 #${variation.bookingId.slice(-6)} 的金額變更。爭議已自動開啟。`,
      type: 'ALERT',
      link: `/dashboard/merchant`
    });
  }

  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Marks a booking as DISPUTED.
 */
export async function disputeBooking(bookingId: string, reason: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'PENDING' },
    include: { merchant: true }
  });

  const { openDispute } = await import('./dispute');
  const res = await openDispute(bookingId, reason);

  // Notify merchant
  await createNotification({
    userId: (booking as any).merchant.userId,
    title: "⚖️ 收到新的爭議單",
    message: `客戶針對預約 #${bookingId.slice(-6)} 提交了爭議：${reason}`,
    type: 'ALERT',
    link: `/dashboard/merchant`
  });

  revalidatePath('/dashboard');
  return res;
}

import { createNotification } from "./notifications";
