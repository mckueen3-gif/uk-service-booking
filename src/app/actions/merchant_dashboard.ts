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

  const merchant = await (prisma as any).merchant.findUnique({
    where: { id: merchantId },
    select: { averageRating: true, totalReviews: true, companyName: true, avatarUrl: true }
  });

  return {
    totalBookings: stats._count.id || 0,
    totalVolume: stats._sum.totalAmount || 0,
    availableBalance: wallet?.availableBalance || 0,
    pendingBalance: wallet?.pendingBalance || 0,
    rating: merchant?.averageRating || 0,
    reviews: merchant?.totalReviews || 0,
    companyName: merchant?.companyName,
    avatarUrl: merchant?.avatarUrl
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
      data: { status: newStatus as any },
      include: { customer: true }
    });

    // If completed, trigger the final fund capture/move logic
    if (newStatus === 'COMPLETED') {
      const { completeBookingFunds } = await import('@/lib/finance');
      await completeBookingFunds(booking);

      // 3. Referral Reward Logic (Passive Income: 2% of each order)
      try {
        const referral = await (prisma as any).referral.findUnique({
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
            const potentialReward = (booking as any).totalAmount * 0.02; // 2% Reward
            const rewardAmount = Math.min(potentialReward, 200 - currentTotal);

            if (rewardAmount > 0) {
              await prisma.$transaction([
                prisma.user.update({
                  where: { id: referral.referrerId },
                  data: { referralCredits: { increment: rewardAmount } }
                }),
                (prisma as any).referral.update({
                  where: { id: referral.id },
                  data: { 
                    earnedFromReferee: { increment: rewardAmount },
                    status: 'COMPLETED'
                  }
                }),
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
      link: `/member`
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
      link: `/merchant`
    });
  }

  revalidatePath('/member');
  revalidatePath('/merchant');
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
    link: `/merchant`
  });

  revalidatePath('/member');
  revalidatePath('/merchant');
  return res;
}

import { createNotification } from "./notifications";

export async function updateMerchantAvatar(avatarUrl: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };
  try {
    await (prisma as any).merchant.update({
      where: { id: merchantId },
      data: { avatarUrl }
    });
    revalidatePath('/merchant');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function rescheduleBooking(bookingId: string, newDate: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId, merchantId },
      data: { scheduledDate: new Date(newDate) },
      include: { customer: true }
    });

    // Notify customer about rescheduling
    await createNotification({
      userId: (booking as any).customerId,
      title: "📅 預約時間已更改",
      message: `您的預約 #${bookingId.slice(-6)} 已被服務商重新安排至 ${new Date(newDate).toLocaleString()}。`,
      type: 'ALERT',
      link: `/member`
    });

    revalidatePath('/merchant');
    revalidatePath('/merchant/schedule');
    return { success: true, booking };
  } catch (err: any) {
    console.error("Reschedule Booking Error:", err);
    return { error: err.message };
  }
}

/**
 * NEW: Accounting & Tax Support Actions
 */
export async function getMerchantAccountingSummary() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { isAccountingActive: true, registrationNumber: true }
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  
  // UK Tax Year Logic: April 6th to April 5th
  let taxYearStart = new Date(currentYear, 3, 6); // April 6, current year
  if (now < taxYearStart) {
    taxYearStart = new Date(currentYear - 1, 3, 6);
  }
  const taxYearEnd = new Date(taxYearStart.getFullYear() + 1, 3, 5, 23, 59, 59);

  // 1. Fetch Tax Year Bookings (Gross & Fees)
  const taxYearBookings = await prisma.booking.findMany({
    where: { 
      merchantId, 
      status: 'COMPLETED',
      updatedAt: { gte: taxYearStart, lte: taxYearEnd }
    },
    select: { totalAmount: true, platformFee: true }
  });

  const grossRevenue = taxYearBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalFees = taxYearBookings.reduce((sum, b) => sum + b.platformFee, 0);
  const netProfit = grossRevenue - totalFees;

  // UK Income Tax Calculation (24/25 Tiers)
  let estimatedTax = 0;
  const personalAllowance = 12570;
  const basicLimit = 50270;
  const higherLimit = 125140;

  if (netProfit > personalAllowance) {
    const taxableBasic = Math.min(netProfit, basicLimit) - personalAllowance;
    if (taxableBasic > 0) estimatedTax += taxableBasic * 0.20;

    const taxableHigher = Math.min(netProfit, higherLimit) - basicLimit;
    if (taxableHigher > 0) estimatedTax += taxableHigher * 0.40;

    const taxableAdditional = netProfit - higherLimit;
    if (taxableAdditional > 0) estimatedTax += taxableAdditional * 0.45;
  }

  // 2. Fetch Monthly Aggregates (Current Calendar Year)
  const calendarYearStart = new Date(currentYear, 0, 1);
  const monthlyData = await prisma.booking.findMany({
    where: {
      merchantId,
      status: 'COMPLETED',
      updatedAt: { gte: calendarYearStart }
    },
    select: { totalAmount: true, platformFee: true, updatedAt: true }
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySummaries = months.map((m, i) => {
    const filtered = monthlyData.filter(d => d.updatedAt.getMonth() === i);
    return {
      month: m,
      revenue: filtered.reduce((sum, b) => sum + b.totalAmount, 0),
      fees: filtered.reduce((sum, b) => sum + b.platformFee, 0)
    };
  });

  return {
    isAccountingActive: merchant?.isAccountingActive || false,
    registrationNumber: merchant?.registrationNumber || "NOT_SET",
    taxYear: `${taxYearStart.getFullYear()}-${taxYearEnd.getFullYear().toString().slice(-2)}`,
    grossRevenue,
    totalFees,
    netProfit,
    estimatedTax,
    monthlySummaries,
    vatProgress: (grossRevenue / 90000) * 100 // 90k UK Threshold
  };
}

export async function activateAccountingSubscription() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const { getStripeClient } = await import("@/lib/stripe");
    const stripe = await getStripeClient();

    // Create a real Stripe Checkout Session for the £4.99/mo subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'ConciergeAI Accounting Premium',
              description: 'Professional Tax Reporting & Monthly Audits',
            },
            unit_amount: 499, // £4.99
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/merchant/accounting?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/merchant/accounting?status=canceled`,
      metadata: {
        merchantId,
        subscription_type: 'accounting_premium'
      }
    });

    return { url: session.url };
  } catch (err: any) {
    console.error("[Stripe Session Error]", err);
    return { error: err.message };
  }
}
