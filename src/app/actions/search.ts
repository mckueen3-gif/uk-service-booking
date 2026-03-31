"use server";

import { prisma } from '@/lib/prisma';
import { getDistance } from '@/lib/geo';
import { unstable_cache } from "next/cache";

export type SearchFilters = {
  query?: string;
  category?: string;
  location?: string; // New: Explicit location filter
  minRating?: number;
  isVerified?: boolean;
  userLat?: number;
  userLon?: number;
  sortBy?: 'rating' | 'jobs' | 'distance' | 'price';
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
};

export async function searchMerchants(filters: SearchFilters) {
  const { query, category, location, minRating, isVerified, userLat, userLon, sortBy, bounds } = filters;
  // ... rest of the function ...

    // 1. Build the where clause for Prisma
    const where: any = {
      isVerified: isVerified ? true : undefined,
      averageRating: minRating ? { gte: minRating } : undefined,
    };

    if (category && category !== 'All') {
      where.services = {
        some: {
          category: {
            equals: category,
            mode: 'insensitive'
          }
        }
      };
    }

    if (location && location !== 'All') {
      where.city = { contains: location, mode: 'insensitive' };
    }

    if (bounds) {
      where.latitude = { gte: bounds.sw.lat, lte: bounds.ne.lat };
      where.longitude = { gte: bounds.sw.lng, lte: bounds.ne.lng };
    }

    if (query) {
      where.OR = [
        { companyName: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { some: { name: { contains: query, mode: 'insensitive' } } } }
      ];
    }

    // 2. Fetch data (including base service for price context)
    let merchants = await prisma.merchant.findMany({
      where,
      include: {
        user: true,
        services: true,
        documents: {
          where: { status: 'APPROVED' }
        }
      }
    });
    console.log('[Search Action] Query:', query, 'Category:', category, 'Location:', location, 'Found Merchants:', merchants.length);

    // Fallback: If no results found with location + query, try searching without location
    if (merchants.length === 0 && location && query) {
      const fallbackWhere = { ...where };
      delete fallbackWhere.city;
      merchants = await prisma.merchant.findMany({
        where: fallbackWhere,
        include: {
          user: true,
          services: true,
          documents: {
            where: { status: 'APPROVED' }
          }
        }
      });
    }

    // 3. Post-process: Add distance and calculate base price
    let results = merchants.map(m => {
      let distance = (userLat && userLon && m.latitude && m.longitude) 
        ? getDistance(userLat, userLon, m.latitude, m.longitude)
        : null;
      
      const basePrice = m.services.length > 0 
        ? Math.min(...m.services.map(s => s.price)) 
        : 0;

      // 🤖 AI Recommendation Scoring
      // High rating + Verification + Proxmity = Higher Score
      let score = (m.averageRating * 10) + (m.isVerified ? 15 : 0);
      if (distance !== null) {
        score -= (distance * 2); // Penalize distance slightly
      }

      return {
        ...m,
        distance,
        basePrice,
        aiScore: score,
        isAiRecommended: false
      };
    });

    // 4. Identify the "Best Match" (AI Recommended)
    if (results.length > 0) {
      const bestMatch = [...results].sort((a, b) => b.aiScore - a.aiScore)[0];
      results = results.map(r => ({
        ...r,
        isAiRecommended: r.id === bestMatch.id
      }));
    }

    // 5. Sorting
    if (sortBy === 'distance' && userLat && userLon) {
      results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'jobs') {
      results.sort((a, b) => ((b as any).completedJobsCount || 0) - ((a as any).completedJobsCount || 0));
    } else if (sortBy === 'price') {
      results.sort((a, b) => a.basePrice - b.basePrice);
    }

    return results;
}
