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

    // 🛡️ Ensure code exists (Auto-generate if missing for existing users)
    let referralCode = user.referralCode;
    if (!referralCode) {
      try {
        const sessionUser = (session.user as any);
        const prefix = (sessionUser?.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        referralCode = `${prefix}${random}`;
        
        await prisma.user.update({
          where: { id: userId },
          data: { referralCode }
        });
      } catch (e) {
        console.error("Referral auto-generation failed in wallet API:", e);
      }
    }

    // 2. Try to fetch creditTransactions separately
    let creditTransactions: any[] = [];
    try {
      const hasTable = !!(prisma as any).creditTransaction;
      if (hasTable) {
        const txs = await safeDbQuery(() =>
          (prisma as any).creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 20
          })
        );
        if (Array.isArray(txs)) {
          creditTransactions = txs;
        }
      }
    } catch (e) {
      console.warn("Could not fetch credit transactions (table might be missing)");
    }

    return NextResponse.json({
      referralCredits: user.referralCredits || 0,
      referralCode: referralCode || (session.user as any)?.referralCode || "PENDING",
      creditTransactions
    });
  } catch (error: any) {
    console.error("Wallet API Error:", error);
    
    // 🛡️ RECOVERY LAYER: Attempt from session
    const sessionUser = (session?.user as any);

    return NextResponse.json({
      referralCredits: 0,
      referralCode: sessionUser?.referralCode || "PENDING",
      creditTransactions: []
    }, { status: 200 });
  }
}
