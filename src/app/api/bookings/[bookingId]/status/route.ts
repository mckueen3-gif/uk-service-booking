import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { sendStatusUpdateEmail } from "@/lib/mail";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user.role !== "MERCHANT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  if (!Object.values(BookingStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // Ensure the merchant owns this booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        merchant: true,
        customer: true,
        service: true
      }
    });

    if (!booking || booking.merchant.userId !== session.user.id) {
       return NextResponse.json({ error: "Booking not found or access denied" }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    // Create a notification for the customer
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: "預約狀態更新 (Booking Update)",
        message: `您的預約 #${bookingId.slice(-6)} 狀態已更新為: ${status}`,
        type: status === "CONFIRMED" ? "SUCCESS" : "INFO",
        link: `/dashboard/repair/${bookingId}`
      }
    });

    // 🚀 NEW: Dispatch Real-world Status Email
    if (booking.customer?.email) {
      sendStatusUpdateEmail(booking.customer.email, {
        customerName: booking.customer.name || "Customer",
        serviceName: booking.service?.name || "Service",
        status: status,
        bookingId: bookingId
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    console.error("Status Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
