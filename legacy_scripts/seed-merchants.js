const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Starting seeding...");

    // 1. FastFix Auto London
    const user1 = await prisma.user.upsert({
      where: { email: 'fastfix@example.com' },
      update: {},
      create: {
        email: 'fastfix@example.com',
        name: 'FastFix Auto',
        role: 'MERCHANT',
      },
    });

    const merchant1 = await prisma.merchant.upsert({
      where: { userId: user1.id },
      update: {},
      create: {
        userId: user1.id,
        companyName: 'FastFix Auto London',
        description: 'Professional car repair and MOT services in London.',
        city: 'London',
        isVerified: true,
        averageRating: 4.8,
        totalReviews: 24,
      },
    });

    await prisma.service.createMany({
      data: [
        { merchantId: merchant1.id, category: 'Automotive', name: 'MOT Test', price: 54.85, description: 'Standard UK MOT test.' },
        { merchantId: merchant1.id, category: 'Automotive', name: 'Full Service', price: 189.00, description: 'Comprehensive car service.' },
        { merchantId: merchant1.id, category: 'Automotive', name: 'Brake Disc Replacement', price: 120.00, description: 'Front/Rear brake discs.' },
      ],
      skipDuplicates: true,
    });

    // 2. Swift Accounting UK
    const user2 = await prisma.user.upsert({
      where: { email: 'swift@example.com' },
      update: {},
      create: {
        email: 'swift@example.com',
        name: 'Swift Admin',
        role: 'MERCHANT',
      },
    });

    const merchant2 = await prisma.merchant.upsert({
      where: { userId: user2.id },
      update: {},
      create: {
        userId: user2.id,
        companyName: 'Swift Accounting UK',
        description: 'Expert VAT, tax and bookkeeping for small businesses.',
        city: 'Manchester',
        isVerified: true,
        averageRating: 4.9,
        totalReviews: 12,
      },
    });

    await prisma.service.createMany({
      data: [
        { merchantId: merchant2.id, category: 'Accounting', name: 'VAT Return Filing', price: 150.00, description: 'Quarterly VAT filing for MTD.' },
        { merchantId: merchant2.id, category: 'Accounting', name: 'Self Assessment', price: 250.00, description: 'Personal tax return filing.' },
        { merchantId: merchant2.id, category: 'Accounting', name: 'Monthly Bookkeeping', price: 80.00, description: 'Xero/Quickbooks management.' },
      ],
      skipDuplicates: true,
    });

    console.log("Seeding completed successfully!");
    
    // List new IDs
    const newMerchants = await prisma.merchant.findMany({
      where: { id: { in: [merchant1.id, merchant2.id] } },
      select: { id: true, companyName: true }
    });
    console.log(JSON.stringify(newMerchants, null, 2));

  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
