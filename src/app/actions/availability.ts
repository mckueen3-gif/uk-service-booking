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

  await (prisma.merchant as any).update({
    where: { id: merchant.id },
    data: { 
      slotDuration,
      maxDailyBookings: maxDaily
    }
  });

  for (const item of data) {
    await (prisma as any).merchantAvailability.upsert({
      where: { merchantId_dayOfWeek: { merchantId: merchant.id, dayOfWeek: item.dayOfWeek } },
      update: { startTime: item.startTime, endTime: item.endTime, isOpen: item.isOpen },
      create: { merchantId: merchant.id, dayOfWeek: item.dayOfWeek, startTime: item.startTime, endTime: item.endTime, isOpen: item.isOpen }
    });
  }

  revalidatePath('/merchant/availability');
  return { success: true };
}

// Custom Schedule Slots (Added dynamically by merchant)
export async function getCustomScheduleSlots(dateStr: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized", slots: [] };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { error: "Not found", slots: [] };

  const startOfDay = new Date(dateStr);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(dateStr);
  endOfDay.setHours(23,59,59,999);

  const customSlots = await (prisma as any).merchantScheduleSlot.findMany({
    where: {
      merchantId: merchant.id,
      date: { gte: startOfDay, lte: endOfDay }
    },
    orderBy: { startTime: 'asc' }
  });

  return { success: true, slots: customSlots };
}

export async function addCustomScheduleSlot(dateStr: string, startTime: string, endTime: string, isAvailable: boolean) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { error: "Not found" };

  const date = new Date(dateStr);
  date.setHours(12, 0, 0, 0); // Normalized date noon

  await (prisma as any).merchantScheduleSlot.create({
    data: {
      merchantId: merchant.id,
      date,
      startTime,
      endTime,
      isAvailable
    }
  });
  
  revalidatePath('/merchant/schedule');
  return { success: true };
}

export async function removeCustomScheduleSlot(slotId: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  await (prisma as any).merchantScheduleSlot.delete({
    where: { id: slotId }
  });

  revalidatePath('/merchant/schedule');
  return { success: true };
}

// 3. Get available slots for a specific date (combining logic)
export async function getAvailableSlots(merchantId: string, dateStr: string) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); 

  const availability = await (prisma as any).merchantAvailability.findUnique({
    where: { merchantId_dayOfWeek: { merchantId, dayOfWeek } }
  });

  const merchant = await (prisma as any).merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant) return [];

  const startOfDay = new Date(dateStr);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(dateStr);
  endOfDay.setHours(23,59,59,999);

  // 1) Fetch Bookings
  const bookings = await prisma.booking.findMany({
    where: {
      merchantId,
      scheduledDate: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELLED' }
    }
  });

  // 2) Fetch Custom Overrides (MerchantScheduleSlot)
  const customArr = await (prisma as any).merchantScheduleSlot.findMany({
    where: { merchantId, date: { gte: startOfDay, lte: endOfDay } }
  });

  if (merchant.maxDailyBookings && bookings.length >= merchant.maxDailyBookings) {
    return []; 
  }

  const durationMs = (merchant.slotDuration || 60) * 60 * 1000;
  const slots: string[] = [];

  // Generate generic weekly slots
  if (availability && availability.isOpen) {
    const [startH, startM] = (availability.startTime as string).split(':').map(Number);
    const [endH, endM] = (availability.endTime as string).split(':').map(Number);
    let current = new Date(dateStr);
    current.setHours(startH, startM, 0, 0);
    const endLimit = new Date(dateStr);
    endLimit.setHours(endH, endM, 0, 0);

    while (current.getTime() + durationMs <= endLimit.getTime()) {
      slots.push(current.toTimeString().substring(0, 5));
      current = new Date(current.getTime() + durationMs);
    }
  }

  // Inject ADDED custom slots
  customArr.filter((c: any) => c.isAvailable).forEach((c: any) => {
    // Generate slots in the custom block
    const [sh, sm] = (c.startTime as string).split(':').map(Number);
    const [eh, em] = (c.endTime as string).split(':').map(Number);
    let cur = new Date(dateStr); cur.setHours(sh, sm, 0, 0);
    let lim = new Date(dateStr); lim.setHours(eh, em, 0, 0);
    while(cur.getTime() + durationMs <= lim.getTime()) {
      const ts = cur.toTimeString().substring(0, 5);
      if(!slots.includes(ts)) slots.push(ts);
      cur = new Date(cur.getTime() + durationMs);
    }
  });

  // Filter BLOCKED custom slots
  let finalSlots = slots.filter(ts => {
    // Check if it's explicitly cancelled/blocked by MerchantScheduleSlot
    const [th, tm] = ts.split(':').map(Number);
    const slotTime = new Date(dateStr).setHours(th, tm, 0, 0);
    
    const isBlocked = customArr.some((c: any) => {
      if(c.isAvailable) return false;
      const [bsh, bsm] = (c.startTime as string).split(':').map(Number);
      const [beh, bem] = (c.endTime as string).split(':').map(Number);
      const blockStart = new Date(dateStr).setHours(bsh, bsm, 0, 0);
      const blockEnd = new Date(dateStr).setHours(beh, bem, 0, 0);
      return slotTime >= blockStart && slotTime < blockEnd;
    });
    return !isBlocked;
  });

  // Check Taken Bookings
  finalSlots = finalSlots.filter(ts => {
    const isTaken = bookings.some(b => {
      const bTime = new Date(b.scheduledDate);
      const [th, tm] = ts.split(':').map(Number);
      return bTime.getHours() === th && bTime.getMinutes() === tm;
    });
    return !isTaken;
  });

  return finalSlots.sort();
}
