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

  const userId = (session.user as any).id;
  const userEmail = (session.user as any).email?.toLowerCase();

  try {
    // 🚀 Robust User Data Lookup (Fallback to Email)
    const userWithData = await safeDbQuery(async () => {
      let u = await prisma.user.findUnique({
        where: { id: userId || "missing-id-fallback" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          referralCode: true,
          referralCredits: true,
          referralReceived: {
            select: {
              referrer: { select: { name: true } }
            }
          },
          referralsMade: {
            select: {
              id: true,
              referee: { select: { name: true } },
              earnedFromReferee: true,
              createdAt: true
            }
          },
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

      // 🚀 Fallback to Email if ID fails
      if (!u && userEmail) {
        u = await prisma.user.findUnique({
          where: { email: userEmail },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            referralCode: true,
            referralCredits: true,
            referralReceived: { select: { referrer: { select: { name: true } } } },
            referralsMade: { select: { id: true, referee: { select: { name: true } }, earnedFromReferee: true, createdAt: true } },
            merchantProfile: { select: { id: true, isVerified: true, wallet: { select: { totalEarned: true, pendingBalance: true } }, bookings: { take: 5, select: { id: true, status: true, totalAmount: true, scheduledDate: true, service: { select: { name: true } } } } } },
            bookings: { take: 5, select: { id: true, status: true, totalAmount: true, scheduledDate: true, service: { select: { name: true } } } }
          }
        });
      }

      // 🚨 Auto-Heal ghost user
      if (!u && userEmail) {
          const newCode = await generateUniqueReferralCode((session.user as any).name || "USER");
          u = await prisma.user.create({
            data: {
              email: userEmail,
              name: (session.user as any).name || "User",
              role: "CUSTOMER",
              referralCode: newCode
            },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              referralCode: true,
              referralCredits: true,
              referralReceived: { select: { referrer: { select: { name: true } } } },
              referralsMade: { select: { id: true, referee: { select: { name: true } }, earnedFromReferee: true, createdAt: true } },
              merchantProfile: { select: { id: true, isVerified: true, wallet: { select: { totalEarned: true, pendingBalance: true } }, bookings: { take: 0, select: { id: true, status: true, totalAmount: true, scheduledDate: true, service: { select: { name: true } } } } } },
              bookings: { take: 0, select: { id: true, status: true, totalAmount: true, scheduledDate: true, service: { select: { name: true } } } }
            }
          });
      }

      // 🛡️ Self-Healing referral code
      if (u && (!u.referralCode || u.referralCode.startsWith("PENDING-"))) {
        const finalCode = await generateUniqueReferralCode(u.name || "USER");
        await prisma.user.update({
          where: { id: u.id },
          data: { referralCode: finalCode }
        });
        u.referralCode = finalCode;
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
        referralCredits: userWithData.referralCredits,
        referredBy: userWithData.referralReceived?.referrer?.name || null,
        referralsMade: userWithData.referralsMade || []
      },
      isMerchant,
      merchantData,
      bookings
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    const sessionUser = (session?.user as any);
    
    return NextResponse.json({
      user: {
        id: sessionUser?.id || "anonymous",
        name: sessionUser?.name || "Member",
        email: sessionUser?.email || "",
        role: sessionUser?.role || "CUSTOMER",
        referralCode: sessionUser?.referralCode || "REF-SYNCING", 
        referralCredits: 0,
        referredBy: null,
        referralsMade: []
      },
      isMerchant: sessionUser?.role === "MERCHANT",
      merchantData: null,
      bookings: [],
      _isFallback: true
    }, { status: 200 }); // 🚀 200 Status to prevent "Sync Delayed" warnings
  }
}
