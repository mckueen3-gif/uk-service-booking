"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function getVehicles() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const vehicles = await (prisma.vehicle as any).findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return { vehicles };
}

export async function addVehicle(data: {
  make: string;
  model: string;
  year: string;
  reg?: string;
  motDate?: string;
  notes?: string;
}) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  let motDateParsed = null;
  if (data.motDate) {
    const d = new Date(data.motDate);
    if (!isNaN(d.getTime())) {
      motDateParsed = d;
    }
  }

  const vehicle = await (prisma.vehicle as any).create({
    data: {
      userId: session.user.id,
      make: data.make,
      model: data.model,
      year: data.year,
      reg: data.reg,
      motDate: motDateParsed,
      notes: data.notes
    }
  });

  revalidatePath('/dashboard/garage');
  return { success: true, vehicle };
}

export async function deleteVehicle(id: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  await (prisma.vehicle as any).delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath('/dashboard/garage');
  return { success: true };
}
