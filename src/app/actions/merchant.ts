'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveFileLocally } from '@/lib/storage';
import { DocumentType, DocumentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function createMerchantAction(data: any) {
  try {
    // 1. Validate mandatory fields
    if (!data.businessName || !data.email || !data.sector || !data.password) {
      return { error: "Missing required fields." };
    }

    // 2. Handle File Physical Persistence (Mock Cloud Storage)
    const avatarUrl = data.avatar ? await saveFileLocally(data.avatar, 'avatars') : null;
    const bannerUrl = data.bannerUrl ? await saveFileLocally(data.bannerUrl, 'banners') : null;
    const credentialUrl = data.credentials ? await saveFileLocally(data.credentials, 'credentials') : null;

    // 3. Determine Free Orders & Commission Rate
    let freeOrders = 0;
    let commissionRate = 0.09;

    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: data.promoCode.toUpperCase() }
      });

      if (promo) {
        if (!(promo.expiresAt && promo.expiresAt < new Date()) && 
            !(promo.maxUses !== null && promo.currentUses >= promo.maxUses)) {
          freeOrders = 5;
          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { currentUses: { increment: 1 } }
          });
        }
      } else if (data.promoCode.trim().length > 0) {
        if (data.promoCode.toUpperCase() === 'JOIN10') freeOrders = 10;
        else if (data.promoCode.toUpperCase() === 'FREE20') freeOrders = 20;
        else return { error: "Invalid promo code." };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    let user = await prisma.user.findFirst({ where: { email: data.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.businessName,
          role: 'MERCHANT',
          phone: data.phone || null
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'MERCHANT', phone: data.phone || user.phone }
      });
    }

    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        companyName: data.businessName,
        description: data.bio || `Premium ${data.sector} services in the UK.`,
        city: data.city || 'London',
        isVerified: false,
        commissionRate: commissionRate,
        freeOrdersLeft: freeOrders,
        avatarUrl,
        bannerUrl,
        licenseUrl: credentialUrl,
        insuranceAmount: data.insuranceAmount ? parseFloat(data.insuranceAmount.replace(/,/g, '')) : 0,
        businessType: data.suggestedCategories ? data.suggestedCategories.join(', ') : data.sector
      }
    });

    // 4. Create initial document entry if uploaded
    if (credentialUrl) {
      await (prisma as any).merchantDocument.create({
        data: {
          merchantId: merchant.id,
          fileUrl: credentialUrl,
          type: data.sector === 'technical' ? DocumentType.BUSINESS_LICENSE : DocumentType.PUBLIC_LIABILITY,
          status: DocumentStatus.PENDING
        }
      });
    }

    // Create a wallet
    await prisma.merchantWallet.create({
      data: { merchantId: merchant.id, totalEarned: 0, availableBalance: 0 }
    });

    revalidatePath('/member');
    revalidatePath('/merchant');
    return { success: true, merchantId: merchant.id };

  } catch (error: any) {
    console.error("Merchant Creation Error:", error);
    return { error: error.message || "Failed to create merchant profile." };
  }
}

/**
 * Admin Action: Update Platform-wide defaults
 */
export async function updateGlobalPlatformSettings(rate: number, defaultFreeOrders: number) {
  // Only for super-admin (security check omitted for demo)
  const settings = await prisma.platformSettings.upsert({
    where: { id: 'GLOBAL_CONFIG' },
    update: { defaultCommissionRate: rate }, // Removed defaultFreeOrders
    create: { id: 'GLOBAL_CONFIG', defaultCommissionRate: rate } // Removed defaultFreeOrders
  });
  return settings;
}
