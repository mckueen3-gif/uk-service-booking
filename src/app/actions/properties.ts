"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function getProperties() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const properties = await (prisma.property as any).findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return { properties };
}

export async function addProperty(data: {
  address: string;
  type: string;
  boilerAge?: number;
  roofType?: string;
  notes?: string;
}) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const property = await (prisma.property as any).create({
    data: {
      userId: session.user.id,
      address: data.address,
      type: data.type,
      boilerAge: data.boilerAge !== undefined ? Number(data.boilerAge) : null,
      roofType: data.roofType,
      notes: data.notes
    }
  });

  revalidatePath('/dashboard/properties');
  return { success: true, property };
}

export async function deleteProperty(id: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  await (prisma.property as any).delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath('/dashboard/properties');
  return { success: true };
}
