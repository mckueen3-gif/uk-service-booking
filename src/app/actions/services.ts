"use server";

import { prisma, safeDbQuery } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

async function getMerchantId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { merchantProfile: true }
  });
  return user?.merchantProfile?.id;
}

export async function getMerchantServices() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Not authorized" };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { merchantProfile: { include: { services: { orderBy: { createdAt: 'desc' as any } } } } }
  });

  if (!user?.merchantProfile) return { error: "Merchant not found" };

  return { 
    services: user.merchantProfile.services,
    city: user.merchantProfile.city
  };
}

export async function upsertService(data: { 
  id?: string, 
  name: string, 
  category: string, 
  description?: string, 
  price: number,
  isEmergencyAble?: boolean,
  emergencySurchargePercentage?: number,
  emergencyResponseTime?: string
}) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Not authorized" };

  try {
    const serviceData: any = {
      name: data.name,
      category: data.category,
      description: data.description,
      price: data.price,
      isEmergencyAble: data.isEmergencyAble,
      emergencySurchargePercentage: data.emergencySurchargePercentage,
      emergencyResponseTime: data.emergencyResponseTime
    };

    if (data.id) {
      const service = await prisma.service.update({
        where: { id: data.id, merchantId },
        data: serviceData
      });
      revalidatePath('/', 'layout');
      return { success: true, service };
    } else {
      const service = await prisma.service.create({
        data: {
          ...serviceData,
          merchantId
        }
      });
      revalidatePath('/', 'layout');
      return { success: true, service };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const getServiceDetails = unstable_cache(
  async (serviceId: string) => {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: { 
          merchant: {
            include: {
              documents: {
                where: { status: 'APPROVED' }
              },
              reviews: {
                include: { customer: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5
              },
              portfolio: {
                orderBy: { createdAt: 'desc' },
                take: 6
              }
            }
          } 
        }
      });
      return { success: true, service };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  ['service-details'],
  { tags: ['services'], revalidate: 3600 }
);

export async function getMerchantDetails(merchantId: string): Promise<{ success: true; merchant: any } | { success: false; error: string }> {
  try {
    return await safeDbQuery(async () => {
      const merchant = await prisma.merchant.findUnique({
        where: { id: merchantId },
        include: {
          documents: {
            where: { status: 'APPROVED' }
          },
          reviews: {
            include: { customer: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          portfolio: {
            orderBy: { createdAt: 'desc' },
            take: 12
          },
          services: true,
          user: {
            select: { name: true, image: true, email: true, phone: true }
          }
        }
      });
      if (!merchant) {
        return { success: false, error: "Merchant not found" };
      }

      return { 
        success: true, 
        merchant: {
          ...merchant,
          youtubeVideoUrl: merchant.youtubeVideoUrl,
          aiKnowledgeBase: merchant.aiKnowledgeBase
        } 
      };
    });
  } catch (err: any) {
    console.error(`[DB Error] getMerchantDetails(${merchantId}):`, {
      message: err.message,
      stack: err.stack,
      code: err.code,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: err.message || "Unknown database error" };
  }
}

export async function deleteService(id: string) {
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Not authorized" };

  await prisma.service.delete({
    where: { id, merchantId }
  });

  revalidatePath('/', 'layout');
  return { success: true };
}
