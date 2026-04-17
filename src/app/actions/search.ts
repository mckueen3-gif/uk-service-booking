"use server";

import { prisma } from "@/lib/prisma";
import { getDistance } from "@/lib/geo";
import { unstable_cache } from "next/cache";

export type SearchFilters = {
  query?: string;
  category?: string;
  location?: string;
  minRating?: number;
  isVerified?: boolean;
  userLat?: number;
  userLon?: number;
  sortBy?: "rating" | "jobs" | "distance" | "price";
  isEmergency?: boolean;
  wizardCriteria?: {
    goal?: string;
    budget?: string;
    timing?: string;
    style?: string;
  };
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
};

// Search Action Logic (Diversity & Budget Aware)
export async function searchMerchants(filters: SearchFilters) {
  const {
    query,
    category,
    location,
    minRating,
    isVerified,
    userLat,
    userLon,
    sortBy,
    bounds,
    isEmergency,
    wizardCriteria,
  } = filters;

  try {
    // 1. Build the where clause
    const where: any = {
      isVerified: isVerified ? true : undefined,
      averageRating: minRating ? { gte: minRating } : undefined,
    };

    // Budget Handling
    if (wizardCriteria?.budget && wizardCriteria.budget !== "No Limit") {
       const budgetStr = wizardCriteria.budget.replace(/£/g, '').split('-');
       if (budgetStr.length === 2) {
          const min = parseFloat(budgetStr[0]);
          const max = parseFloat(budgetStr[1]);
          where.baseHourlyRate = { gte: min, lte: max };
       }
    }

    if ((category && category !== "All") || isEmergency) {
      where.services = {
        some: {
          ...(category && category !== "All"
            ? { category: { equals: category, mode: "insensitive" } }
            : {}),
          ...(isEmergency ? { isEmergencyAble: true } : {}),
        },
      };
    }

    if (location && location !== "All") {
      where.city = { contains: location, mode: "insensitive" };
    }

    if (bounds) {
      where.latitude = { gte: bounds.sw.lat, lte: bounds.ne.lat };
      where.longitude = { gte: bounds.sw.lng, lte: bounds.ne.lng };
    }

    if (query) {
      where.OR = [
        { companyName: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          services: {
            some: { name: { contains: query, mode: "insensitive" } },
          },
        },
      ];
    }

    // 2. Fetch data
    let merchants = await prisma.merchant.findMany({
      where,
      include: {
        user: true,
        services: true,
        portfolio: true,
        documents: {
          where: { status: "APPROVED" },
        },
      },
    });

    // 3. Post-process
    let results = merchants.map((m) => {
      let distance = userLat && userLon && m.latitude && m.longitude
          ? getDistance(userLat, userLon, m.latitude, m.longitude)
          : null;

      const basePrice = m.baseHourlyRate || (m.services.length > 0 ? Math.min(...m.services.map((s) => s.price)) : 0);

      // AI Score calculation for ranking
      let score = m.averageRating * 10 + (m.isVerified ? 15 : 0) + (m.isElite ? 20 : 0);
      if (distance !== null) score -= distance * 2;

      return {
        ...m,
        distance,
        basePrice,
        aiScore: score,
        isAiRecommended: false,
      };
    });

    // 4. Identify the "Calibrated Match"
    if (results.length > 0) {
      const bestMatch = [...results].sort((a, b) => b.aiScore - a.aiScore)[0];
      results = results.map((r) => ({
        ...r,
        isAiRecommended: r.id === bestMatch.id,
      }));
    }

    // 5. Sorting
    if (sortBy === "distance" && userLat && userLon) {
      results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "jobs") {
      results.sort((a, b) => (b.completedJobsCount || 0) - (a.completedJobsCount || 0));
    } else if (sortBy === "price") {
      results.sort((a, b) => a.basePrice - b.basePrice);
    }

    return results;
  } catch (error) {
    console.error("[Search Action] Error:", error);
    return [];
  }
}

// Diversity-Aware Recommendations
export async function getSmartRecommendations(filters: SearchFilters) {
  const { category, userLat, userLon, wizardCriteria } = filters;

  const where: any = {
    isVerified: true,
    services: {
      some: {
        category: category !== "All" ? category : undefined,
      },
    },
  };

  // Budget Filter for Recommendations too
  if (wizardCriteria?.budget && wizardCriteria.budget !== "No Limit") {
    const budgetStr = wizardCriteria.budget.replace(/£/g, '').split('-');
    if (budgetStr.length === 2) {
       where.baseHourlyRate = { gte: parseFloat(budgetStr[0]), lte: parseFloat(budgetStr[1]) };
    }
  }

  const merchants = await prisma.merchant.findMany({
    where,
    include: {
      services: true,
      availability: true,
      bookings: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
          scheduledDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
    take: 30, // Get a larger pool for diversity
    orderBy: { averageRating: "desc" },
  });

  if (merchants.length === 0) return { best: null, closest: null, earliest: null };

  const processed = merchants.map((m) => {
    const distance = userLat && userLon && m.latitude && m.longitude
        ? getDistance(userLat, userLon, m.latitude, m.longitude)
        : Infinity;

    const basePrice = m.baseHourlyRate || (m.services.length > 0 ? Math.min(...m.services.map((s) => s.price)) : 0);
    const aiScore = m.averageRating * 10 + m.completedJobsCount * 0.5 - (distance === Infinity ? 0 : distance) + (m.isElite ? 20 : 0);

    return { ...m, distance, aiScore, basePrice };
  });

  // 🏛️ Diversity Algorithm: Top Match | Rising Star | Value Expert
  
  // 1. Top Match (Elite preference)
  const best = [...processed].sort((a, b) => b.aiScore - a.aiScore)[0];

  // 2. Rising Star (Verified but new on platform, prevents winner-takes-most)
  const risingStar = [...processed]
    .filter(m => m.id !== best.id && m.completedJobsCount < 5)
    .sort((a, b) => b.averageRating - a.averageRating)[0];

  // 3. Best Value (Lowest price in the pool)
  const bestValue = [...processed]
    .filter(m => m.id !== best.id && (!risingStar || m.id !== risingStar.id))
    .sort((a, b) => a.basePrice - b.basePrice)[0];

  return {
    topMatch: best ? { ...best, reason: "topMatch" } : null,
    risingStar: risingStar ? { ...risingStar, reason: "risingStar" } : null,
    bestValue: bestValue ? { ...bestValue, reason: "bestValue" } : null,
  };
}
