"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function claimReferralCode(code: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "You must be logged in to claim a referral code." };
  }

  const userId = (session.user as any).id;

  try {
    // 1. Check if user already has a referral record (as a referee)
    const existingReferral = await prisma.referral.findFirst({
      where: { refereeId: userId }
    });

    if (existingReferral) {
      return { error: "You have already claimed a referral code." };
    }

    // 2. Find the referrer by code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code.toUpperCase() },
      select: { id: true }
    });

    if (!referrer) {
      return { error: "Invalid referral code. Please check and try again." };
    }

    if (referrer.id === userId) {
      return { error: "You cannot refer yourself." };
    }

    // 3. Create the referral link
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: userId,
      }
    });

    revalidatePath("/member");
    return { success: true };
  } catch (error) {
    console.error("Claim referral error:", error);
    return { error: "Failed to claim referral code due to a server error." };
  }
}
