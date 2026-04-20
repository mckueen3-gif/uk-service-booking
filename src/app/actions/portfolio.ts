"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { getMerchantId } from '@/lib/merchant-utils';

export async function addPortfolioItem(data: { title: string, description?: string, imageUrl: string, category?: string }) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const item = await (prisma as any).merchantPortfolio.create({
      data: {
        merchantId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category
      }
    });
    revalidatePath(`/book/${merchantId}`);
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deletePortfolioItem(id: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    await (prisma as any).merchantPortfolio.delete({
      where: { id, merchantId }
    });
    revalidatePath(`/book/${merchantId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getMerchantPortfolio(merchantId: string) {
  try {
    const portfolio = await (prisma as any).merchantPortfolio.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' }
    });
    return { portfolio };
  } catch (err) {
    return { portfolio: [] };
  }
}
