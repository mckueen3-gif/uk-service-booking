'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface MerchantAnalytics {
  revenueTrend: MonthlyRevenue[];
  statusDistribution: { status: string; count: number }[];
  performanceMetrics: {
    conversionRate: number;
    averageRating: number;
    repeatCustomerRate: number;
    totalEarnings: number;
  };
  sentiment: {
    positiveKeywords: string[];
    negativeKeywords: string[];
    sentimentScore: number; // 0-100
  };
}

export async function getMerchantAnalytics() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MERCHANT') {
    return null;
  }

  const userId = (session.user as any).id;
  const merchant = await prisma.merchant.findUnique({
    where: { userId },
    include: {
      bookings: {
        include: { service: true }
      },
      reviews: true
    }
  });

  if (!merchant) return null;

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  // Revenue Trend
  const revenueTrend: MonthlyRevenue[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(sixMonthsAgo);
    d.setMonth(sixMonthsAgo.getMonth() + i);
    const monthStr = d.toLocaleString('zh-TW', { month: 'short' });
    
    const monthBookings = merchant.bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate.getMonth() === d.getMonth() && bDate.getFullYear() === d.getFullYear();
    });

    const revenue = monthBookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    revenueTrend.push({
      month: monthStr,
      revenue,
      bookings: monthBookings.length
    });
  }

  // Status Distribution
  const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  const statusDistribution = statuses.map(status => ({
    status,
    count: merchant.bookings.filter(b => b.status === status).length
  }));

  // Performance Metrics
  const totalRequests = merchant.bookings.length;
  const confirmedBookings = merchant.bookings.filter(b => b.status !== 'CANCELLED' && b.status !== 'PENDING').length;
  const conversionRate = totalRequests > 0 ? (confirmedBookings / totalRequests) * 100 : 0;
  
  const totalEarnings = merchant.bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Repeat Customer Rate
  const customerIds = merchant.bookings.map(b => b.customerId);
  const uniqueCustomers = new Set(customerIds).size;
  const repeatCustomers = customerIds.length - uniqueCustomers;
  const repeatCustomerRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  // Sentiment (Simplified Mock/Aggregation for MerchantAnalytics UI)
  const positiveKeywords = ['準時', '專業', '價格公道', '親切', '效率高'];
  const negativeKeywords = ['遲到', '溝通欠佳', '稍微昂貴'];
  const sentimentScore = merchant.averageRating * 20; // 0-5 scaled to 0-100

  return {
    revenueTrend,
    statusDistribution,
    performanceMetrics: {
      conversionRate: Math.round(conversionRate),
      averageRating: merchant.averageRating,
      repeatCustomerRate: Math.round(repeatCustomerRate),
      totalEarnings
    },
    sentiment: {
      positiveKeywords,
      negativeKeywords,
      sentimentScore
    }
  };
}

/**
 * Historical/Existing Review Analytics for the specifically dedicated page
 */
export async function getReviewAnalytics() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MERCHANT') {
    return { error: 'Unauthorized' };
  }

  const userId = (session.user as any).id;
  const merchant = await prisma.merchant.findUnique({
    where: { userId },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!merchant) return { error: 'Merchant not found' };

  // Calculate Distribution
  const distribution = [0, 0, 0, 0, 0]; // 5 star down to 1 star
  merchant.reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[5 - r.rating]++;
    }
  });

  const sentiment = {
    positiveCount: merchant.reviews.filter(r => (r as any).sentiment === 'POSITIVE').length,
    neutralCount: merchant.reviews.filter(r => (r as any).sentiment === 'NEUTRAL').length,
    negativeCount: merchant.reviews.filter(r => (r as any).sentiment === 'NEGATIVE').length
  };

  return {
    averageRating: merchant.averageRating,
    totalReviews: merchant.totalReviews,
    distribution,
    sentiment,
    topKeywords: ['效率高', '準時', '專業', '親切'],
    recentReviews: merchant.reviews.slice(0, 10),
    marketPosition: {
      percentile: 85,
      mainCategory: 'Automotive',
      categoryAvg: 4.2,
      rank: 3,
      totalCategory: 24
    }
  };
}

export async function submitMerchantReply(reviewId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'MERCHANT') {
    return { error: 'Unauthorized' };
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: { reply: content }
  });

  revalidatePath('/dashboard/analytics');
  return { success: true };
}
