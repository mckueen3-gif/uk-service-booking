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

    // 1. Fetch user base fields independently so we ALWAYS get the referral code
    const user = await safeDbQuery(() =>
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          referralCredits: true,
          referralCode: true,
        }
      })
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Try to fetch creditTransactions separately
    let creditTransactions: any[] = [];
    try {
      const txs = await safeDbQuery(() =>
        (prisma as any).creditTransaction?.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20
        })
      );
      if (txs) {
        creditTransactions = txs;
      }
    } catch (e) {
      console.warn("Could not fetch credit transactions (table might be missing)");
    }

    return NextResponse.json({
      referralCredits: user.referralCredits || 0,
      referralCode: user.referralCode || "PENDING",
      creditTransactions
    });
  } catch (error: any) {
    console.error("Wallet API Error:", error);
    // Generic fallback only if user query entirely crashes
    return NextResponse.json({
      referralCredits: 0,
      referralCode: "PENDING",
      creditTransactions: []
    }, { status: 200 });
  }
}
