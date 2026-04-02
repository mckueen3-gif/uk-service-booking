"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";

async function ensureAdmin() {
  const session = await getServerSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function getMarketplaceStats(days = 30) {
  await ensureAdmin();

  const startDate = startOfDay(subDays(new Date(), days));

  // 1. GMV & Volume Trend
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startDate },
      status: "COMPLETED"
    },
    select: {
      createdAt: true,
      totalAmount: true,
      platformFee: true,
      isEducation: true
    }
  });

  // Calculate trends
  const interval = eachDayOfInterval({ 
    start: startDate, 
    end: new Date() 
  });

  const dailyTrend = interval.map(date => {
    const dayStr = format(date, 'MMM dd');
    const dayBookings = bookings.filter(b => 
      format(new Date(b.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return {
      date: dayStr,
      gmv: dayBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      revenue: dayBookings.reduce((sum, b) => sum + b.platformFee, 0),
      bookings: dayBookings.length
    };
  });

  // 2. Sector Distribution (Simplified logic for demonstration)
  // We'll treat education bookings separately
  const educationCount = bookings.filter(b => b.isEducation).length;
  const nonEducationCount = bookings.length - educationCount;

  return {
    dailyTrend,
    distribution: [
      { name: 'Education', value: educationCount },
      { name: 'Services/Auto', value: nonEducationCount }
    ],
    summary: {
      totalGMV: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
      totalRevenue: bookings.reduce((sum, b) => sum + b.platformFee, 0),
      count: bookings.length
    }
  };
}
