import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Merchant Data...');

  // 1. Create or find the "Blocker" user
  const user = await prisma.user.upsert({
    where: { email: 'blocker@conciergeai.uk' },
    update: {},
    create: {
      email: 'blocker@conciergeai.uk',
      name: 'Blocker',
      role: 'MERCHANT' as any,
    },
  });

  console.log(`✅ User created: ${user.email}`);

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

  console.log(`✅ Merchant Profile created/verified: ${merchant.companyName}`);

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

  console.log('✅ Wallet initialized.');

  console.log('\n🚀 Seed complete! You can now log in as blocker@conciergeai.uk to see the dashboard.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
