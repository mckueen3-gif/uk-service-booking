const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  console.log('--- Password Hashing Fix Start ---');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const emails = [
    'customer_test@example.com',
    'merchant_edu@example.com',
    'merchant_repair@example.com',
    'merchant_acc@example.com'
  ];

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const email of emails) {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log(`Updated Password for: ${email}`);
  }

  console.log('--- Password Hashing Fix Done ---');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
