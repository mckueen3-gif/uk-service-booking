import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import MemberHomeClient from "./MemberHomeClient";

export const metadata: Metadata = {
  title: "My Dashboard | ConciergeAI",
  description: "Your personal AI-powered life concierge dashboard. Manage bookings, chat with AI, and discover top specialists.",
};

export const dynamic = "force-dynamic";

export default async function MemberHomePage() {
  // ── Auth Guard ──────────────────────────────────────────────────────────
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error("[MemberHome] Session error:", err);
  }

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/member/home");
  }

  const userId = session.user.id;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ── Fetch User AI Data & Bookings ─────────────────────────────────────
  let userData: any = null;
  let bookings: any[] = [];
  try {
    userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        dailyAiLimitUsed: true,
        lastAiUsageDate: true,
        educationAttempts: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { quiz: { select: { title: true, subject: true } } }
        },
        bookings: {
          where: { customerId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            scheduledDate: true,
            totalAmount: true,
            service: { select: { name: true } },
            merchant: {
              select: {
                id: true,
                companyName: true,
                user: { select: { name: true } },
              },
            },
            googleMeetLink: true,
            isEducation: true,
          },
        }
      }
    });
    bookings = userData?.bookings ?? [];
  } catch (err) {
    console.error("[MemberHome] Data fetch error:", err);
  }

  // ── Fetch Top Merchants (defensive) ──────────────────────────────────
  let merchants: any[] = [];
  try {
    merchants = await prisma.merchant.findMany({
      where: { isVerified: true },
      orderBy: { averageRating: "desc" },
      take: 6,
      select: {
        id: true,
        companyName: true,
        businessType: true,
        city: true,
        averageRating: true,
        avatarUrl: true,
        user: { select: { name: true } },
      },
    });
  } catch (err) {
    console.error("[MemberHome] Merchants fetch error:", err);
  }

  // ── Logic for Quota ────────────────────────────────────────────────────
  const hasPaidBooking = bookings.some(b => ['CONFIRMED', 'COMPLETED'].includes(b.status) && b.isEducation);
  const aiLimit = hasPaidBooking ? 5 : 2;
  const lastUsage = userData?.lastAiUsageDate;
  const usedToday = (!lastUsage || new Date(lastUsage).getTime() < today.getTime()) ? 0 : (userData?.dailyAiLimitUsed ?? 0);

  // ── Serialization ──────────────────────────────────────────────────────
  const serializedBookings = bookings.map((b: any) => ({
    ...b,
    scheduledDate: b.scheduledDate?.toISOString?.() ?? null,
    totalAmount: b.totalAmount ?? null,
  }));

  const serializedAttempts = (userData?.educationAttempts ?? []).map((a: any) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <MemberHomeClient
      userName={session.user.name ?? session.user.email ?? "用戶"}
      bookings={serializedBookings}
      merchants={merchants}
      aiStats={{
        usedToday,
        limit: aiLimit,
        attempts: serializedAttempts
      }}
    />
  );
}
