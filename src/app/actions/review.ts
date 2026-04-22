"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { getMerchantId } from '@/lib/merchant-utils';

export async function submitReview(bookingId: string, data: { rating: number; comment: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { merchant: true }
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== 'COMPLETED') throw new Error("Only completed services can be reviewed.");

  // AI Sentiment Analysis
  const { analyzeReview } = await import('@/lib/sentiment');
  const aiResults = await analyzeReview(data.comment);

  // Create Review
  const review = await (prisma.review as any).create({
    data: {
      bookingId,
      customerId: (session.user as any).id,
      merchantId: booking.merchantId,
      rating: data.rating,
      comment: data.comment,
      sentiment: aiResults.sentiment,
      keywords: aiResults.keywords.join(",")
    }
  });

  // Recalculate Merchant Rating
  const allReviews = await prisma.review.findMany({
    where: { merchantId: booking.merchantId },
    select: { rating: true }
  });

  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  await prisma.merchant.update({
    where: { id: booking.merchantId },
    data: {
      averageRating: avgRating,
      totalReviews: allReviews.length
    }
  });

  revalidatePath(`/dashboard/repair/${bookingId}`);
  revalidatePath(`/dashboard/repair/${bookingId}/review`);
  revalidatePath(`/merchant/reviews`);
  return { success: true, review };
}

export async function submitReply(reviewId: string, reply: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error("Unauthorized");

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId }
  });

  if (!existingReview) throw new Error("Review not found");
  if (existingReview.merchantId !== merchantId) throw new Error("Unauthorized access to review");

  const updated = await (prisma.review as any).update({
    where: { id: reviewId },
    data: { reply }
  });

  revalidatePath(`/merchant/reviews`);
  revalidatePath(`/book/${existingReview.merchantId}`);
  
  return { success: true, review: updated };
}

export async function getMerchantReviews() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Unauthorized" };

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        reviews: {
          include: {
            customer: { select: { name: true, image: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!merchant) return { error: "Merchant profile not found." };

    const stats = {
      total: merchant.totalReviews || 0,
      avg: merchant.averageRating?.toFixed(1) || "0.0",
      positive: merchant.reviews.filter((r: any) => (r as any).sentiment === 'POSITIVE').length,
      negative: merchant.reviews.filter((r: any) => (r as any).sentiment === 'NEGATIVE').length
    };

    return { merchant, stats };
  } catch (err: any) {
    return { error: err.message };
  }
}
