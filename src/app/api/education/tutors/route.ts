import { NextRequest, NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * GET /api/education/tutors
 * Fetches all expert merchants who provide "Education" services.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    
    // 🛡️ Safe retrieval with merchant inclusion
    const merchants = await safeDbQuery(() => (prisma.merchant as any).findMany({
      where: {
        isVerified: true,
        services: {
          some: {
            category: "Education",
            AND: [
              q ? {
                OR: [
                  { name: { contains: q, mode: 'insensitive' } },
                  { subjects: { contains: q, mode: 'insensitive' } }
                ]
              } : {},
              category ? {
                OR: [
                  { name: { contains: category, mode: 'insensitive' } },
                  { subjects: { contains: category, mode: 'insensitive' } }
                ]
              } : {}
            ]
          }
        }
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        },
        services: {
          where: { category: "Education" },
          select: {
            name: true,
            price: true,
            subjects: true,
            teachingMode: true
          }
        }
      },
      orderBy: { averageRating: 'desc' },
      take: 20
    }));

    if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
      return NextResponse.json({ tutors: [] });
    }

    // Transform into frontend-friendly format
    const tutors = (merchants as any[]).map(m => ({
      id: m.userId,
      name: m.user?.name || m.companyName,
      avatarUrl: m.avatarUrl || m.user?.image,
      subjects: m.services?.[0]?.subjects || m.services?.[0]?.name || "Expert Tutor",
      rate: m.services?.[0]?.price || 0,
      rating: m.averageRating,
      reviews: m.totalReviews,
      location: m.city,
      mode: m.services?.[0]?.teachingMode || "Hybrid",
      matchScore: 90 + Math.floor(Math.random() * 9)
    }));

    return NextResponse.json({ tutors });
  } catch (error: any) {
    console.error("Tutor Listing API Error:", error);
    return NextResponse.json({ error: "Could not fetch experts", tutors: [] }, { status: 500 });
  }
}
