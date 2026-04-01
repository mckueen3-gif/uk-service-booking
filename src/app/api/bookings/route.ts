import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized", bookings: [] }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    const bookings = await safeDbQuery(() =>
      prisma.booking.findMany({
        where: { customerId: userId },
        orderBy: { scheduledDate: 'desc' },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          scheduledDate: true,
          createdAt: true,
          vehicleReg: true,
          vehicleMake: true,
          vehicleModel: true,
          service: { select: { name: true } },
          merchant: { select: { companyName: true } }
        }
      })
    );

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error: any) {
    console.error("Bookings API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", bookings: [] }, { status: 500 });
  }
}
