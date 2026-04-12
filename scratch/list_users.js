
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 10,
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    }
  });
  console.log('Users:', JSON.stringify(users, null, 2));

  const merchants = await prisma.merchant.findMany({
    take: 5,
    select: {
      id: true,
      companyName: true,
      userId: true
    }
  });
  console.log('Merchants:', JSON.stringify(merchants, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
