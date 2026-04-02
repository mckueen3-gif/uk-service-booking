'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createMerchantAction(data: any) {
  try {
    // 1. Validate mandatory fields
    if (!data.businessName || !data.email || !data.sector) {
      return { error: "Missing required fields." };
    }

    // 2. Determine Free Orders & Commission Rate
    let freeOrders = 0; // Default: No free orders (Admin/Code controlled)
    let commissionRate = 0.09; // Default: 9%

    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: data.promoCode.toUpperCase() }
      });

      if (promo) {
        if (promo.expiresAt && promo.expiresAt < new Date()) {
          return { error: "Promo code has expired." };
        }
        if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
          return { error: "Promo code has reached its usage limit." };
        }

        // Apply promo benefits
        // freeOrders = promo.freeOrdersCount; // Temporarily Disabled
        freeOrders = 5; // Default promo benefit for any valid code
        
        // Increment usage count
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { currentUses: { increment: 1 } }
        });
      } else {
        // Optional: return error or just ignore invalid code? 
        // User requested "Join with CODE", so let's be strict if they entered something.
        if (data.promoCode.trim().length > 0) {
           // If we want to support hardcoded "JOIN5" or "FREE10" for testing:
           if (data.promoCode.toUpperCase() === 'JOIN10') freeOrders = 10;
           else if (data.promoCode.toUpperCase() === 'FREE20') freeOrders = 20;
           else return { error: "Invalid promo code." };
        }
      }
    }

    let user = await prisma.user.findFirst({ where: { email: data.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.businessName,
          role: 'MERCHANT'
        }
      });
    } else {
      // Upgrade existing user to MERCHANT if they are a CUSTOMER
      if (user.role !== 'MERCHANT' && user.role !== 'ADMIN') {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'MERCHANT' }
        });
      }
    }

    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        companyName: data.businessName,
        description: data.bio || `Premium ${data.sector} services in the UK.`,
        city: data.city || 'London', // Use sector location or default
        isVerified: false,
        commissionRate: commissionRate,
        freeOrdersLeft: freeOrders,
      }
    });

    // Create a wallet for the new merchant
    await prisma.merchantWallet.create({
      data: {
        merchantId: merchant.id,
        totalEarned: 0,
        availableBalance: 0
      }
    });

    revalidatePath('/dashboard');
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
