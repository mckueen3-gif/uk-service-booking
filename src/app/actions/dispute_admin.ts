"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

async function ensureAdmin() {
  const session = await getServerSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function resolveDispute(disputeId: string, decision: "REFUND_CUSTOMER" | "FORCE_PAYOUT" | "SPLIT_COST") {
  await ensureAdmin();

  try {
    return await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.update({
        where: { id: disputeId },
        data: { 
          status: "RESOLVED"
        },
        include: { booking: true }
      });

      // Update Booking Status and Financials based on resolution
      if (decision === "REFUND_CUSTOMER") {
        await tx.booking.update({
          where: { id: dispute.bookingId },
          data: { status: "CANCELLED" }
        });
      } else if (decision === "FORCE_PAYOUT") {
        await tx.booking.update({
          where: { id: dispute.bookingId },
          data: { status: "COMPLETED" }
        });
      }

      revalidatePath("/admin/disputes");
      revalidatePath("/admin/bookings");
      revalidatePath("/admin");
      
      return { success: true, message: `Dispute resolved as: ${decision}` };
    });
  } catch (e) {
    console.error("Dispute resolution error:", e);
    return { success: false, message: "Arbitration failed technically." };
  }
}

export async function getOpenDisputes() {
  await ensureAdmin();

  return await prisma.dispute.findMany({
    where: { status: "OPEN" },
    include: {
      booking: {
        include: {
          customer: { select: { name: true } },
          merchant: { select: { companyName: true } }
        }
      },
      evidence: true
    },
    orderBy: { createdAt: 'desc' }
  });
}
