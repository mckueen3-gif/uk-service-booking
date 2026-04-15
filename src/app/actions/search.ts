"use server";

import { prisma } from "@/lib/prisma";
import { getDistance } from "@/lib/geo";
import { unstable_cache } from "next/cache";

export type SearchFilters = {
  query?: string;
  category?: string;
  location?: string; // New: Explicit location filter
  minRating?: number;
  isVerified?: boolean;
  userLat?: number;
  userLon?: number;
  sortBy?: "rating" | "jobs" | "distance" | "price";
  isEmergency?: boolean;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
};

// Search Action Logic
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
  } = filters;

  try {
    // 1. Build the where clause for Prisma
    const where: any = {
      isVerified: isVerified ? true : undefined,
      averageRating: minRating ? { gte: minRating } : undefined,
    };

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

    // 2. Fetch data (including base service for price context)
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

    // Fallback: If no results found with location + query, try searching without location
    if (merchants.length === 0 && location && query) {
      const fallbackWhere = { ...where };
      delete fallbackWhere.city;
      merchants = await prisma.merchant.findMany({
        where: fallbackWhere,
        include: {
          user: true,
          services: true,
          portfolio: true,
          documents: {
            where: { status: "APPROVED" },
          },
        },
      });
    }

    // 3. Post-process: Add distance and calculate base price
    let results = merchants.map((m) => {
      let distance =
        userLat && userLon && m.latitude && m.longitude
          ? getDistance(userLat, userLon, m.latitude, m.longitude)
          : null;

      const basePrice =
        m.services.length > 0 ? Math.min(...m.services.map((s) => s.price)) : 0;

      // AI Recommendation Scoring
      // High rating + Verification + Proxmity = Higher Score
      let score = m.averageRating * 10 + (m.isVerified ? 15 : 0);
      if (distance !== null) {
        score -= distance * 2; // Penalize distance slightly
      }

      return {
        ...m,
        distance,
        basePrice,
        aiScore: score,
        isAiRecommended: false,
      };
    });

    // 4. Identify the "Best Match" (AI Recommended)
    if (results.length > 0) {
      const bestMatch = [...results].sort((a, b) => b.aiScore - a.aiScore)[0];
      results = results.map((r) => ({
        ...r,
        isAiRecommended: r.id === bestMatch.id,
      }));
    }

    // 5. Sorting
    if (sortBy === "distance" && userLat && userLon) {
      results.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity),
      );
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "jobs") {
      results.sort(
        (a, b) =>
          ((b as any).completedJobsCount || 0) -
          ((a as any).completedJobsCount || 0),
      );
    } else if (sortBy === "price") {
      results.sort((a, b) => a.basePrice - b.basePrice);
    }

    return results;
  } catch (error) {
    console.error("[Search Action] Error:", error);
    return [];
  }
}

// NEW: getSmartRecommendations
export async function getSmartRecommendations(filters: SearchFilters) {
  const { category, userLat, userLon } = filters;

  // 1. Fetch top candidates in the category
  const merchants = await prisma.merchant.findMany({
    where: {
      isVerified: true,
      services: {
        some: {
          category: category !== "All" ? category : undefined,
        },
      },
    },
    include: {
      services: true,
      availability: true,
      bookings: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
          scheduledDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
          },
        },
      },
    },
    take: 15,
    orderBy: { averageRating: "desc" },
  });

  if (merchants.length === 0)
    return { best: null, closest: null, earliest: null };

  const processed = merchants.map((m) => {
    const distance =
      userLat && userLon && m.latitude && m.longitude
        ? getDistance(userLat, userLon, m.latitude, m.longitude)
        : Infinity;

    // AI Score calculation
    const aiScore =
      m.averageRating * 10 +
      m.completedJobsCount * 0.5 -
      (distance === Infinity ? 0 : distance);

    return { ...m, distance, aiScore };
  });

  // 2. Identify Best Match (Highest AI Score)
  const best = [...processed].sort((a, b) => b.aiScore - a.aiScore)[0];

  // 3. Identify Closest
  const closest =
    userLat && userLon
      ? [...processed].sort((a, b) => a.distance - b.distance)[0]
      : null;

  // 4. Identify Earliest (Heuristic: check slot availability for tomorrow)
  // For simplicity in this demo, we'll choose the one with the fewest bookings tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const earliest = [...processed].sort((a, b) => {
    const aBookings = a.bookings.filter(
      (bk) => bk.scheduledDate >= tomorrow && bk.scheduledDate <= endOfTomorrow,
    ).length;
    const bBookings = b.bookings.filter(
      (bk) => bk.scheduledDate >= tomorrow && bk.scheduledDate <= endOfTomorrow,
    ).length;
    return aBookings - bBookings;
  })[0];

  return {
    best: best ? { ...best, reason: "topMatch" } : null,
    closest:
      closest && closest.id !== best.id
        ? { ...closest, reason: "closest" }
        : null,
    earliest:
      earliest &&
      earliest.id !== best.id &&
      (!closest || earliest.id !== closest.id)
        ? { ...earliest, reason: "earliest" }
        : null,
  };
}
