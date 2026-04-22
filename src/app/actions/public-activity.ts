"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicActivities() {
  try {
    // 1. Fetch recent high-quality activities
    const [recentMerchants, recentBookings] = await Promise.all([
      prisma.merchant.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          companyName: true,
          city: true,
          createdAt: true,
        }
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              city: true
            }
          },
          service: {
            select: {
              category: true
            }
          }
        }
      })
    ]);

    // 2. Format activities with masking
    const activities = [
      ...recentMerchants.map(m => ({
        type: 'MERCHANT_JOIN',
        name: m.companyName.length > 8 ? m.companyName.substring(0, 3) + '...' : m.companyName,
        city: m.city,
        timestamp: m.createdAt,
      })),
      ...recentBookings.map(b => ({
        type: 'BOOKING_DONE',
        name: b.customer?.name?.split(' ')[0] || "A client",
        city: b.customer?.city || "London",
        category: b.service?.category,
        timestamp: b.createdAt,
      }))
    ];

    // 3. Simulated events if data is sparse (to ensure high trust feeling)
    const simulatedLocations = ["London", "Manchester", "Birmingham", "Oxford", "Cambridge", "Bristol"];
    const simulatedNames = ["James", "Emma", "Sarah", "Michael", "Sophie", "David", "Jessica"];
    const simulatedCategories = ["Plumbing", "Tutoring", "Cleaning", "Electrician", "Accounting"];

    if (activities.length < 10) {
      const extraCount = 10 - activities.length;
      for (let i = 0; i < extraCount; i++) {
        const isBooking = Math.random() > 0.4;
        activities.push({
          type: isBooking ? 'BOOKING_DONE' : 'MERCHANT_JOIN',
          name: isBooking ? simulatedNames[Math.floor(Math.random() * simulatedNames.length)] : "New Pro",
          city: simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)],
          category: isBooking ? simulatedCategories[Math.floor(Math.random() * simulatedCategories.length)] : undefined,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 24)), // Randomly within last 24h
        } as any);
      }
    }

    return {
      success: true,
      activities: activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };
  } catch (error) {
    console.error("Error fetching public activities:", error);
    return {
      success: false,
      activities: []
    };
  }
}
