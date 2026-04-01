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

    const userWithData = await safeDbQuery(async () => {
      let u = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          referralCode: true,
          referralCredits: true,
          merchantProfile: {
            select: {
              id: true,
              isVerified: true,
              wallet: {
                select: {
                  totalEarned: true,
                  pendingBalance: true
                }
              },
              bookings: {
                orderBy: { scheduledDate: 'desc' },
                take: 5,
                select: {
                  id: true,
                  status: true,
                  totalAmount: true,
                  scheduledDate: true,
                  service: { select: { name: true } }
                }
              }
            }
          },
          bookings: {
            orderBy: { scheduledDate: 'desc' },
            take: 5,
            select: {
              id: true,
              status: true,
              totalAmount: true,
              scheduledDate: true,
              service: { select: { name: true } }
            }
          }
        }
      });

      // Auto-generate referral code if missing (common for Google sign-ups)
      if (u && !u.referralCode) {
        const prefix = (u.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        const newCode = `${prefix}${random}`;
        
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { referralCode: newCode }
          });
          u.referralCode = newCode;
        } catch (e) {
          console.error("Failed to persist generated referral code:", e);
        }
      }

      return u;
    });

    if (!userWithData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMerchant = userWithData.role === "MERCHANT";
    const merchantData = userWithData.merchantProfile;
    const bookings = isMerchant ? (merchantData?.bookings || []) : (userWithData.bookings || []);

    return NextResponse.json({
      user: {
        id: userWithData.id,
        name: userWithData.name,
        email: userWithData.email,
        role: userWithData.role,
        referralCode: userWithData.referralCode,
        referralCredits: userWithData.referralCredits
      },
      isMerchant,
      merchantData,
      bookings
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    // Return graceful fallback so dashboard shell still renders
    return NextResponse.json({
      user: {
        id: "error-fallback",
        name: "User",
        email: "",
        role: "CUSTOMER",
        referralCode: "REF-PENDING", // Prevent showing '------'
        referralCredits: 0
      },
      isMerchant: false,
      merchantData: null,
      bookings: []
    }, { status: 200 });
  }
}
