const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🛠️ Adding '電路重拉' service to 'Volt & Pipe Solutions'...");
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: 'merch_voltpipe_03' }
    });

    if (!merchant) {
      console.error("❌ Merchant 'merch_voltpipe_03' not found.");
      return;
    }

    await prisma.service.create({
      data: {
        merchantId: merchant.id,
        name: "專業全屋電路重拉 (Full House Rewire)",
        category: "Plumbing", // Closest category we have in dropdown
        price: 2500.00,
        description: "符合英國 BS 7671 標準的專業電路重拉服務。包含配電箱升級與完整測試證明。"
      }
    });

    console.log("✅ Service '電路重拉' added successfully.");

  } catch (err) {
    console.error("❌ Error updating database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
