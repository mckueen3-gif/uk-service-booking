const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Checking Database for Merchants and Services...");
  try {
    const merchantCount = await prisma.merchant.count();
    const serviceCount = await prisma.service.count();
    const merchants = await prisma.merchant.findMany({
      include: { services: true }
    });

    console.log(`\n📊 Database Stats:`);
    console.log(`- Merchants: ${merchantCount}`);
    console.log(`- Services: ${serviceCount}`);

    console.log(`\n👨‍🔧 Merchant Details:`);
    merchants.forEach(m => {
      console.log(`- ${m.companyName} (ID: ${m.id})`);
      console.log(`  City: ${m.city}, Verified: ${m.isVerified}, Rating: ${m.averageRating}`);
      console.log(`  Services: ${m.services.map(s => `[${s.category}] ${s.name} (£${s.price})`).join(', ')}`);
    });

  } catch (err) {
    console.error("❌ Error query database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
