"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { formatDistanceToNow } from "date-fns";

export async function getLiveActivities(limit = 20) {
  const session = await getServerSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Fetch multiple types of data and merge them into a unified stream
  const [newUsers, newBookings, newPayments] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { customer: { select: { name: true } }, merchant: { select: { companyName: true } } }
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { booking: { select: { id: true } } }
    })
  ]);

  const activities = [
    ...newUsers.map(u => ({
      id: `user-${u.id}`,
      type: 'USER_SIGNUP',
      title: 'New Member Joined',
      message: `${u.name || u.email} joined as a ${u.role.toLowerCase()}`,
      timestamp: u.createdAt,
      icon: 'USER'
    })),
    ...newBookings.map(b => ({
      id: `booking-${b.id}`,
      type: 'NEW_BOOKING',
      title: 'Booking Created',
      message: `${b.customer.name} booked ${b.merchant.companyName} for £${b.totalAmount}`,
      timestamp: b.createdAt,
      icon: 'CALENDAR'
    })),
    ...newPayments.map(p => ({
      id: `payment-${p.id}`,
      type: 'PAYMENT_SECURE',
      title: 'Payment Secured',
      message: `Transaction processed for booking #${p.booking.id.slice(-6)}`,
      timestamp: p.createdAt,
      icon: 'WALLET'
    }))
  ];

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
    .map(a => ({
      ...a,
      timeAgo: formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })
    }));
}
