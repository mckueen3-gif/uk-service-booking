"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveFullProfile(userId: string, data: { 
  name?: string; 
  phone?: string; 
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  businessName?: string; 
  description?: string;
  isMerchant: boolean;
}) {
  try {
    // 1. Update Base User Data
    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        city: data.city,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        postcode: data.postcode
      }
    });
    
    // 2. Update Merchant Data if applicable
    if (data.isMerchant) {
      const merchant = await prisma.merchant.findUnique({
        where: { userId }
      });

      if (merchant) {
        await prisma.merchant.update({
          where: { id: merchant.id },
          data: {
            companyName: data.businessName,
            description: data.description
          }
        });
      }
    }

    // 3. Single Revalidation
    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (error) {
    console.error("Profile save error:", error);
    return { success: false, error: "Failed to save profile updates." };
  }
}
