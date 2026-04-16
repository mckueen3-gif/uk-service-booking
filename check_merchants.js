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

  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        user: true,
      }
    });
    console.log('--- Current Merchants ---');
    merchants.forEach(m => {
      console.log(`ID: ${m.id}, Name: ${m.companyName}, UserID: ${m.userId}, Email: ${m.user.email}`);
    });
    console.log('-------------------------');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
