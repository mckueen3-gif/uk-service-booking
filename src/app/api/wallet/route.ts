import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { generateUniqueReferralCode } from "@/lib/referral-utils";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const userEmail = (session.user as any).email?.toLowerCase();

    // 🚀 Robust User Lookup (Fallback to Email)
    const user = await safeDbQuery(async () => {
      // First try by ID
      let foundUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          referralCredits: true,
          referralCode: true,
          name: true,
          referralsMade: {
            select: {
              id: true,
              referee: { select: { name: true } },
              earnedFromReferee: true,
              createdAt: true,
              commissionExpiresAt: true
            }
          }
        }
      });

      // Fallback: If ID lookup fails, try by Email
      if (!foundUser && userEmail) {
        foundUser = await prisma.user.findUnique({
          where: { email: userEmail },
          select: {
            id: true,
            referralCredits: true,
            referralCode: true,
            name: true,
            referralsMade: {
              select: {
                id: true,
                referee: { select: { name: true } },
                earnedFromReferee: true,
                createdAt: true,
                commissionExpiresAt: true
              }
            }
          }
        });
      }
      return foundUser;
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🛡️ CONFLICT-SAFE Self-healing: Ensure code exists and is professional
    let referralCode = user.referralCode;
    if (!referralCode || referralCode.startsWith("PENDING-")) {
      try {
        const finalCode = await generateUniqueReferralCode(user.name || "USER");
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode: finalCode }
        });
        referralCode = finalCode;
      } catch (e) {
        console.error("Referral auto-generation failed in wallet API:", e);
      }
    }

    // 2. Fetch creditTransactions separately
    let creditTransactions: any[] = [];
    try {
      const hasTable = !!(prisma as any).creditTransaction;
      if (hasTable) {
        const txs = await safeDbQuery(() =>
          (prisma as any).creditTransaction.findMany({
            where: { userId: user.id },
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
      referralCode: referralCode || "PENDING",
      creditTransactions
    });
  } catch (error: any) {
    console.error("Wallet API Error:", error);
    const sessionUser = (session?.user as any);

    return NextResponse.json({
      referralCredits: 0,
      referralCode: sessionUser?.referralCode || "REF-SYNCING",
      creditTransactions: []
    }, { status: 202 });
  }
}
