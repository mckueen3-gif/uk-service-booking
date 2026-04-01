'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Updates the commission rate for a specific merchant.
 * @param merchantId The unique ID of the merchant.
 * @param newRate The new commission rate as a decimal (e.g., 0.1 for 10%).
 */
export async function updateMerchantCommissionRate(merchantId: string, newRate: number) {
  try {
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { commissionRate: newRate }
    });
    
    revalidatePath('/admin/commissions');
    return { success: true };
  } catch (error: any) {
    console.error("Admin Update Rate Error:", error);
    return { error: error.message };
  }
}

/**
 * Manually adds free orders to a merchant's account.
 * (e.g., Admin rewarding a merchant or manually applying a benefit).
 * [Temporarily Disabled due to Schema Sync]
 */
/*
export async function updateMerchantFreeOrders(merchantId: string, count: number) {
  try {
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { freeOrdersLeft: count }
    });
    
    revalidatePath('/admin/commissions');
    return { success: true };
  } catch (error: any) {
    console.error("Admin Update Free Orders Error:", error);
    return { error: error.message };
  }
}
*/
