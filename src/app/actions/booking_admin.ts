"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { recordInitialBookingPayment, completeBookingFunds } from "@/lib/finance";

async function ensureAdmin() {
  const session = await getServerSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function adminCancelAndRefund(bookingId: string) {
  await ensureAdmin();

  try {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" }
      });

      // Logic for Stripe refund could go here if integrated
      // For now, update local state
      
      revalidatePath("/admin/bookings");
      revalidatePath("/admin");
      return { success: true, message: "Booking cancelled and marked for refund." };
    });
  } catch (e) {
    console.error("Admin refund error:", e);
    return { success: false, message: "Technical failure during refund." };
  }
}

export async function adminForceComplete(bookingId: string) {
  await ensureAdmin();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { merchant: true }
    });

    if (!booking || booking.status === "COMPLETED") {
       return { success: false, message: "Booking already completed or not found." };
    }

    // Use our central finance library to release funds
    await completeBookingFunds(bookingId);

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { success: true, message: "Funds released manually to expert." };
  } catch (e) {
    console.error("Force complete error:", e);
    return { success: false, message: "Failed to release funds." };
  }
}

export async function getAllBookings(query = "") {
  await ensureAdmin();

  return await prisma.booking.findMany({
    where: {
      OR: [
        { id: { contains: query, mode: 'insensitive' } },
        { customer: { name: { contains: query, mode: 'insensitive' } } },
        { merchant: { companyName: { contains: query, mode: 'insensitive' } } }
      ]
    },
    include: {
      customer: { select: { name: true, email: true } },
      merchant: { select: { companyName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}
