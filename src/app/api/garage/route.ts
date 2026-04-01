import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized", vehicles: [] }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    const vehicles = await safeDbQuery(() =>
      (prisma as any).vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    );

    return NextResponse.json({ vehicles: vehicles || [] });
  } catch (error: any) {
    // ✅ ALWAYS return 200 with empty array — prevents the dashboard error.tsx from showing
    // The Vehicle table might not be migrated yet; degrade gracefully.
    console.error("Garage API Error (degraded gracefully):", error?.message || error);
    return NextResponse.json({ vehicles: [], degraded: true });
  }
}
