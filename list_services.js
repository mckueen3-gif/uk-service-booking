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

  const services = await prisma.service.findMany({
    select: { id: true, name: true, category: true, merchantId: true }
  });
  console.log(JSON.stringify(services, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
