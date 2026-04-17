const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer_test@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'customer_test@example.com',
      name: 'Test Customer',
      role: 'CUSTOMER',
      password: hashedPassword,
    }
  });
  console.log(`Customer created/updated: ${customer.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
