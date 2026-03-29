"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SERVICE_TEMPLATES } from '@/lib/constants/service_templates';

async function getMerchantId() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return null;
  
  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });
  return merchant?.id;
}

/**
 * Fetches all services provided by the current merchant.
 */
export async function getMerchantServices() {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const services = await prisma.service.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, services };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Adds a service to the merchant's catalog using a pre-defined template.
 */
export async function addServiceFromTemplate(templateId: string, customPrice?: number) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  const template = SERVICE_TEMPLATES.find(t => t.id === templateId);
  if (!template) return { error: "Template not found" };

  try {
    const service = await prisma.service.create({
      data: {
        merchantId,
        name: template.name,
        category: template.category,
        price: customPrice || template.defaultPrice,
        description: template.description + (template.isMonthly ? " (按月收費 Per Month)" : "")
      }
    });
    revalidatePath('/dashboard/merchant/services');
    return { success: true, service };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Manually adds or updates a service.
 */
export async function upsertService(data: { id?: string, name: string, category: string, price: number, description?: string }) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    if (data.id) {
       const service = await prisma.service.update({
         where: { id: data.id, merchantId },
         data: {
           name: data.name,
           category: data.category,
           price: data.price,
           description: data.description
         }
       });
       revalidatePath('/dashboard/merchant/services');
       return { success: true, service };
    } else {
       const service = await prisma.service.create({
         data: {
           merchantId,
           name: data.name,
           category: data.category,
           price: data.price,
           description: data.description
         }
       });
       revalidatePath('/dashboard/merchant/services');
       return { success: true, service };
    }
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Deletes a service from the merchant catalog.
 */
export async function deleteService(serviceId: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    await prisma.service.delete({
      where: { id: serviceId, merchantId }
    });
    revalidatePath('/dashboard/merchant/services');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
