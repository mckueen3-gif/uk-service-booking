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

  console.log("Fetching latest bookings...");
  const bookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, vehicleReg: true, status: true }
  });
  console.log(JSON.stringify(bookings, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
