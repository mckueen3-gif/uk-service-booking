const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('Searching for the most recent user...');
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  if (users.length === 0) {
    console.error('No users found in database.');
    return;
  }

  const user = users[0];
  console.log(`Found user: ${user.email} (ID: ${user.id}). Current role: ${user.role}`);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  console.log(`Successfully promoted ${user.email} to ADMIN.`);
}

main()
  .catch((e) => {
    console.error('Promotion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
