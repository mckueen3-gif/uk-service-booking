"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Ensures user is authenticated
 */
async function ensureAuthenticated() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/**
 * Add a new vehicle to the user's garage
 */
export async function addVehicle(data: {
  make: string;
  model: string;
  year: string;
  reg?: string;
  notes?: string;
}) {
  const userId = await ensureAuthenticated();

  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      userId
    }
  });

  revalidatePath("/dashboard/profile/assets");
  return { success: true, vehicle };
}

/**
 * Add a new property to the user's profile
 */
export async function addProperty(data: {
  address: string;
  type: string;
  boilerAge?: number;
  roofType?: string;
  notes?: string;
}) {
  const userId = await ensureAuthenticated();

  const property = await prisma.property.create({
    data: {
      ...data,
      userId
    }
  });

  revalidatePath("/dashboard/profile/assets");
  return { success: true, property };
}

/**
 * Get all user assets (Vehicles & Properties)
 */
export async function getUserAssets() {
  const userId = await ensureAuthenticated();

  const vehicles = await prisma.vehicle.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const properties = await prisma.property.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return { vehicles, properties };
}

/**
 * Delete a vehicle
 */
export async function deleteVehicle(id: string) {
  const userId = await ensureAuthenticated();
  
  await prisma.vehicle.delete({
    where: { id, userId }
  });

  revalidatePath("/dashboard/profile/assets");
  return { success: true };
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string) {
  const userId = await ensureAuthenticated();
  
  await prisma.property.delete({
    where: { id, userId }
  });

  revalidatePath("/dashboard/profile/assets");
  return { success: true };
}
