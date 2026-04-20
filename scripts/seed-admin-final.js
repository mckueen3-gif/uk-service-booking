require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@conciergeai.uk";
  const password = "admin123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Administrator'
    },
    create: {
      email,
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      referralCode: 'ADMIN-ROOT-' + Math.random().toString(36).substring(7).toUpperCase()
    }
  });

  console.log('✅ Local Admin Account Ready:');
  console.log('Email:', user.email);
  console.log('Password:', password);
  console.log('Role:', user.role);
}

main()
  .catch(e => {
    console.error('❌ Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
