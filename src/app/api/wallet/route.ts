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

    const user = await safeDbQuery(() =>
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          referralCredits: true,
          referralCode: true,
          creditTransactions: {
            orderBy: { createdAt: "desc" },
            take: 20
          }
        }
      })
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      referralCredits: user.referralCredits || 0,
      referralCode: user.referralCode || "",
      creditTransactions: user.creditTransactions || []
    });
  } catch (error: any) {
    console.error("Wallet API Error:", error);
    // Fallback data if table (like creditTransactions) is missing
    return NextResponse.json({
      referralCredits: 0,
      referralCode: "PENDING",
      creditTransactions: []
    }, { status: 200 }); // Return 200 so UI doesn't show connection error but handles empty state
  }
}
