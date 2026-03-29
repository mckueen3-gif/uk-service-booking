"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export type AvailabilityInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
};

// 1. Fetch current merchant availability
export async function getMerchantAvailability() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await (prisma.merchant as any).findUnique({
    where: { userId: session.user.id },
    include: { availability: true }
  });

  if (!merchant) return { error: "Merchant profile not found" };

  return { merchant, availability: merchant.availability };
}

// 2. Update merchant availability
export async function updateMerchantAvailability(data: AvailabilityInput[], slotDuration: number, maxDaily: number) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { error: "Merchant not found" };

  // Update merchant base settings
  await (prisma.merchant as any).update({
    where: { id: merchant.id },
    data: { 
      slotDuration,
      maxDailyBookings: maxDaily
    }
  });

  // Update availability days (upsert)
  for (const item of data) {
    await (prisma as any).merchantAvailability.upsert({
      where: {
        merchantId_dayOfWeek: {
          merchantId: merchant.id,
          dayOfWeek: item.dayOfWeek
        }
      },
      update: {
        startTime: item.startTime,
        endTime: item.endTime,
        isOpen: item.isOpen
      },
      create: {
        merchantId: merchant.id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        isOpen: item.isOpen
      }
    });
  }

  revalidatePath('/merchant/availability');
  return { success: true };
}

// 3. Get available slots for a specific date
export async function getAvailableSlots(merchantId: string, dateStr: string) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0-6

  // Fetch merchant's general availability for this day
  const availability = await (prisma as any).merchantAvailability.findUnique({
    where: { 
      merchantId_dayOfWeek: { merchantId, dayOfWeek } 
    }
  });

  if (!availability || !availability.isOpen) {
    return [];
  }

  const merchant = await (prisma as any).merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant) return [];

  // Fetch existing bookings for this day
  const startOfDay = new Date(dateStr);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(dateStr);
  endOfDay.setHours(23,59,59,999);

  const bookings = await prisma.booking.findMany({
    where: {
      merchantId,
      scheduledDate: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: { not: 'CANCELLED' }
    }
  });

  // 🚀 NEW: Check Daily Capacity Limit
  if (merchant.maxDailyBookings && bookings.length >= merchant.maxDailyBookings) {
    return []; // Capacity reached for the day
  }

  // Calculate slots
  const slots: string[] = [];
  const [startH, startM] = (availability.startTime as string).split(':').map(Number);
  const [endH, endM] = (availability.endTime as string).split(':').map(Number);

  let current = new Date(dateStr);
  current.setHours(startH, startM, 0, 0);
  
  const endLimit = new Date(dateStr);
  endLimit.setHours(endH, endM, 0, 0);

  const durationMs = (merchant.slotDuration || 60) * 60 * 1000;

  while (current.getTime() + durationMs <= endLimit.getTime()) {
    const timeStr = current.toTimeString().substring(0, 5); // "HH:mm"
    
    // Check if slot is taken
    const isTaken = bookings.some(b => {
      const bTime = new Date(b.scheduledDate);
      return bTime.getHours() === current.getHours() && bTime.getMinutes() === current.getMinutes();
    });

    if (!isTaken) {
      slots.push(timeStr);
    }

    current = new Date(current.getTime() + durationMs);
  }

  return slots;
}
