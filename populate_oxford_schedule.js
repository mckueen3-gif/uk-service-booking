const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  console.log('--- Populating Oxford Tutors UK Schedule ---');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const merchantId = 'cmo0edn7o000vcsuh1yxgdxxp';

  // 1. Verify merchant exists
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant) {
    console.error(`Merchant with ID ${merchantId} not found!`);
    await prisma.$disconnect();
    await pool.end();
    return;
  }

  console.log(`Found merchant: ${merchant.companyName}`);

  // 2. Generate slots for the next 7 days
  const now = new Date();
  const slots = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    date.setHours(0, 0, 0, 0);

    // Morning slot
    slots.push({
      merchantId,
      date,
      startTime: '10:00',
      endTime: '11:00',
      isAvailable: true,
      title: 'Academic Tutoring'
    });

    // Afternoon slot
    slots.push({
      merchantId,
      date,
      startTime: '14:00',
      endTime: '15:00',
      isAvailable: true,
      title: 'STEM Support'
    });
  }

  // 3. Clear existing slots first to avoid duplicates (optional but cleaner for testing)
  await prisma.merchantScheduleSlot.deleteMany({
    where: { merchantId }
  });

  // 4. Create new slots
  const created = await prisma.merchantScheduleSlot.createMany({
    data: slots
  });

  console.log(`Successfully created ${created.count} slots.`);

  await prisma.$disconnect();
  await pool.end();
  console.log('--- Done ---');
}

main().catch(console.error);
