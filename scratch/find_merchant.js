process.env.DATABASE_URL = "postgresql://postgres.omwmlqivzwudrzwwggsk:CnP%25_UQdpYNKa9x@aws-1-eu-central-2.pooler.supabase.com:5432/postgres";

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const merchants = await prisma.merchant.findMany({
      take: 1,
      select: { id: true, companyName: true, isAccountingActive: true }
    });
    console.log(JSON.stringify(merchants[0]));
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(console.error);
