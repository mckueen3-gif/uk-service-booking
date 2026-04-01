import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    const properties = await safeDbQuery(() => 
      prisma.property.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    );

    return NextResponse.json({ properties: properties || [] });
  } catch (error: any) {
    console.error("Properties API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", properties: [] }, { status: 500 });
  }
}
