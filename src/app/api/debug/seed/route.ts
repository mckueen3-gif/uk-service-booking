import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DEBUG ONLY: Seeds a test merchant for the "Blocker" persona.
 * This ensures the dashboard is not blank and functions correctly.
 */
export async function GET() {
  console.log('🌱 Seeding Merchant Data via API...');

  try {
    // 1. Create or find the "Blocker" user
    const user = await prisma.user.upsert({
      where: { email: 'blocker@conciergeai.uk' },
      update: {
        password: '$2b$10$bGmGqzUrpOnw8hZePMSs/uoLWq11bh.XVbvdqZGOGeYFs.UsWrkKy', // password123
      },
      create: {
        email: 'blocker@conciergeai.uk',
        name: 'Blocker',
        password: '$2b$10$bGmGqzUrpOnw8hZePMSs/uoLWq11bh.XVbvdqZGOGeYFs.UsWrkKy', // password123
        role: 'MERCHANT' as any,
      },
    });

    console.log(`✅ User found/created: ${user.email}`);

    // 2. Create or update the Merchant Profile
    const merchant = await (prisma as any).merchant.upsert({
      where: { userId: user.id },
      update: {
        isVerified: true,
        isElite: true,
        companyName: 'Oxford Tutors UK',
        businessType: 'GCSE_MATHS',
        baseHourlyRate: 75.0,
        city: 'Oxford',
      },
      create: {
        userId: user.id,
        companyName: 'Oxford Tutors UK',
        description: 'Expert GCSE Maths & Physics tutoring service based in Oxford.',
        city: 'Oxford',
        isVerified: true,
        isElite: true,
        businessType: 'GCSE_MATHS',
        baseHourlyRate: 75.0,
        averageRating: 4.9,
        totalReviews: 124,
      },
    });

    console.log(`✅ Merchant Profile: ${merchant.companyName}`);

    // 3. Ensure a Wallet exists
    await prisma.merchantWallet.upsert({
      where: { merchantId: merchant.id },
      update: {},
      create: {
        merchantId: merchant.id,
        availableBalance: 1250.50,
        pendingBalance: 450.00,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Seed complete',
      merchant: merchant.companyName 
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ 
      error: true, 
      message: error.message 
    }, { status: 500 });
  }
}
