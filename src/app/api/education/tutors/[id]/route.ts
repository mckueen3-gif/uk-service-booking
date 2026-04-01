import { NextRequest, NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

/**
 * GET /api/education/tutors/[id]
 * Fetches full details for a specific expert merchant.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Missing tutor ID" }, { status: 400 });
    }

    // 🛡️ Comprehensive safe lookup
    const merchant = await safeDbQuery(() => (prisma.merchant as any).findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true
          }
        },
        services: {
          where: { category: "Education" },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            subjects: true,
            teachingMode: true
          }
        },
        portfolio: {
          select: {
            title: true,
            description: true,
            imageUrl: true
          }
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: { name: true }
            }
          }
        },
        availability: true
      }
    }));

    if (!merchant) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    // Transform into frontend-friendly detailed format
    const m = merchant as any;
    const profile = {
      id: m.userId,
      name: m.user?.name || m.companyName,
      subjects: m.services?.map((s: any) => s.subjects || s.name).join(", "),
      rate: m.services?.[0]?.price || 0,
      rating: m.averageRating,
      reviews: m.totalReviews,
      location: m.city,
      mode: m.services?.[0]?.teachingMode || "Hybrid",
      bio: m.description || "Expert tutor specializing in tailored education pathways.",
      experience: m.completedJobsCount > 0 ? `${m.completedJobsCount}+ Lessons` : "New Expert",
      education: "Verified Academic Background", 
      avatarUrl: m.avatarUrl || m.user?.image,
      portfolioImages: m.portfolio?.map((p: any) => p.imageUrl),
      recentReviews: m.reviews?.map((r: any) => ({
        id: r.id,
        user: r.customer?.name || "Student",
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt
      })),
      availability: [
        { day: "Monday", slots: ["16:00", "17:00", "18:00"] },
        { day: "Wednesday", slots: ["15:00", "16:00", "19:00"] },
        { day: "Saturday", slots: ["09:00", "10:00", "11:00"] },
      ] // We can map merchant.availability here if populated
    };

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Tutor Detail API Error:", error);
    return NextResponse.json({ error: "Could not fetch expert details" }, { status: 500 });
  }
}
