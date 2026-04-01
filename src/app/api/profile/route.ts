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
    const user = await safeDbQuery(() => prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        postcode: true,
        referralCredits: true,
        referralCode: true,
        createdAt: true,
        merchantProfile: {
          select: {
            companyName: true,
            description: true
          }
        }
      }
    }));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile API Error:", error);
    
    // 🛡️ RECOVERY LAYER: Use session info as a last resort
    const sUser = (session.user as any);
    return NextResponse.json({
      id: sUser.id,
      email: sUser.email,
      name: sUser.name,
      role: sUser.role,
      referralCode: sUser.referralCode || "PENDING",
      referralCredits: 0
    }, { status: 200 });
  }
}
