const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔑 Creating/Ensuring Admin User...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@concierge.ai' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@concierge.ai',
      name: 'Concierge Administrator',
      role: 'ADMIN',
    }
  });

  console.log('✅ Admin user ready:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
