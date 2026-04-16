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

  const id = 'cmo0edn7o000vcsuh1yxgdxxp';
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        user: true,
        services: true,
      }
    });
    console.log('Merchant:', JSON.stringify(merchant, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
