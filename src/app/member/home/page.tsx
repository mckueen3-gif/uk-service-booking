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

  // ── Fetch Bookings (recent 3, defensive) ───────────────────────────────
  let bookings: any[] = [];
  try {
    const bookingModel = (prisma as any).booking;
    if (bookingModel) {
      bookings = await bookingModel.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          status: true,
          scheduledDate: true,
          totalAmount: true,
          service: { select: { name: true } },
          merchant: {
            select: {
              companyName: true,
              user: { select: { name: true } },
            },
          },
        },
      });
    }
  } catch (err) {
    console.error("[MemberHome] Bookings fetch error:", err);
    bookings = [];
  }

  // ── Fetch Top Merchants for Feed (defensive) ───────────────────────────
  let merchants: any[] = [];
  try {
    const merchantModel = (prisma as any).merchant;
    if (merchantModel) {
      merchants = await merchantModel.findMany({
        where: { isVerified: true },
        orderBy: { averageRating: "desc" },
        take: 6,
        select: {
          id: true,
          companyName: true,
          category: true,
          city: true,
          averageRating: true,
          avatarUrl: true,
          user: { select: { name: true } },
        },
      });
    }
  } catch (err) {
    console.error("[MemberHome] Merchants fetch error:", err);
    merchants = [];
  }

  // ── Serialize dates for client ─────────────────────────────────────────
  const serializedBookings = bookings.map((b: any) => ({
    ...b,
    scheduledDate: b.scheduledDate?.toISOString?.() ?? null,
    totalAmount: b.totalAmount ?? null,
  }));

  return (
    <MemberHomeClient
      userName={session.user.name ?? session.user.email ?? "用戶"}
      bookings={serializedBookings}
      merchants={merchants}
    />
  );
}
