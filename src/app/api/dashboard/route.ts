import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { generateUniqueReferralCode } from "@/lib/referral-utils";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isForce = searchParams.get('force') === 'true';
  const isRepair = searchParams.get('repair') === 'true' || isForce;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userEmail = (session.user as any).email?.toLowerCase();

  try {
    // 🛡️ PHASE 1: SELF-HEALING (Only if explicitly requested or needed)
    if (isRepair) {
      const basicUser = await prisma.user.findUnique({
        where: { id: userId || "idx" },
        select: { id: true, role: true, name: true, merchantProfile: { select: { id: true } } }
      });

      if (basicUser && basicUser.role === "MERCHANT" && !basicUser.merchantProfile) {
        console.log(`[Critical Repair] Auto-creating Merchant Profile for ${basicUser.id}`);
        await prisma.merchant.upsert({
          where: { userId: basicUser.id },
          update: {},
          create: {
            userId: basicUser.id,
            companyName: basicUser.name || "Specialist",
            city: "London",
            isVerified: false
          }
        });
      }
      
      // Auto-create wallet if merchant profile exists
      const merchant = await prisma.merchant.findUnique({ where: { userId: basicUser?.id || "idx" } });
      if (merchant) {
        await prisma.merchantWallet.upsert({
          where: { merchantId: merchant.id },
          update: {},
          create: {
            merchantId: merchant.id,
            availableBalance: 0,
            pendingBalance: 0,
            totalEarned: 0,
            authorizedBalance: 0
          }
        });
      }
    }

    // 🚀 PHASE 2: CONSOLIDATED ROBUST QUERY
    // This phase fetches everything needed for the dashboard in one go.
    const userWithData = await safeDbQuery(async () => {
      return await prisma.user.findUnique({
        where: { id: userId || "missing-id" },
        include: {
          referralReceived: { include: { referrer: { select: { name: true } } } },
          referralsMade: { 
            include: { referee: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
          },
          merchantProfile: {
            include: {
              wallet: true,
              bookings: {
                orderBy: { scheduledDate: 'desc' },
                take: 10,
                include: { service: { select: { name: true } } }
              }
            }
          },
          bookings: {
            orderBy: { scheduledDate: 'desc' },
            take: 10,
            include: { service: { select: { name: true } } }
          }
        }
      });
    });

    if (!userWithData) {
      return NextResponse.json({ error: "User profile out of sync" }, { status: 404 });
    }

    // 🚀 PHASE 3: FLATTEN & SAFELY MAP
    const isMerchant = userWithData.role === "MERCHANT";
    const rawMerchant = userWithData.merchantProfile;
    
    // Ensure merchantData root has all stats DashboardContent expects
    const merchantData = rawMerchant ? {
      ...rawMerchant,
      balanceAvailable: rawMerchant.wallet?.availableBalance || 0,
      balanceHeld: rawMerchant.wallet?.pendingBalance || 0,
      totalEarned: rawMerchant.wallet?.totalEarned || 0,
      rating: rawMerchant.averageRating || 5.0,
      id: rawMerchant.id
    } : null;

    const bookings = isMerchant ? (rawMerchant?.bookings || []) : (userWithData.bookings || []);

    return NextResponse.json({
      user: {
        id: userWithData.id,
        name: userWithData.name,
        email: userWithData.email,
        role: userWithData.role,
        referralCode: userWithData.referralCode,
        referralCredits: userWithData.referralCredits,
        referredBy: userWithData.referralReceived?.referrer?.name || null,
        referralsMade: userWithData.referralsMade || []
      },
      isMerchant,
      merchantData,
      bookings,
      _isFallback: false
    });

  } catch (error) {
    console.error("Dashboard API High-Level Crash:", error);
    const sessionUser = (session?.user as any);
    
    return NextResponse.json({
      user: {
        id: sessionUser?.id || "anonymous",
        name: sessionUser?.name || "Member",
        role: sessionUser?.role || "CUSTOMER",
        referralCode: "REF-SYNCING",
        referralCredits: 0
      },
      isMerchant: sessionUser?.role === "MERCHANT",
      merchantData: { 
        balanceAvailable: 0, 
        balanceHeld: 0, 
        totalEarned: 0,
        _isFallback: true 
      },
      bookings: [],
      _isFallback: true,
      _diagnostic: {
        reason: error instanceof Error ? error.message : "Internal Database Flux",
        timestamp: new Date().toISOString()
      }
    }, { status: 200 }); // Return 200 with fallback data to avoid UI white screens
  }
}
