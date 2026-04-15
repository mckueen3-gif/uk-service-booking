const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const merchants = await prisma.merchant.findMany({
    select: { id: true, companyName: true }
  });
  console.log('Current Merchants:');
  merchants.forEach(m => {
    console.log(`${m.companyName}: https://www.conciergeai.uk/merchant/${m.id}`);
  });
  await prisma.$disconnect();
  await pool.end();
}
main();
