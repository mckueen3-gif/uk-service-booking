'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new promo code for merchants.
 */
export async function createPromoCode(data: {
  code: string;
  freeOrdersCount: number;
  maxUses: number;
  expiresAt?: string;
}) {
  try {
    const promo = await prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        maxUses: data.maxUses,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    revalidatePath('/admin');
    return { success: true, promo };
  } catch (error: any) {
    return { error: "Failed to create promo code: " + error.message };
  }
}

/**
 * Lists all active promo codes.
 */
export async function getPromoCodes() {
  return await prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' }
  });
}
