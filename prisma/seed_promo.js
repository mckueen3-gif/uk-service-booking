const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Promo Codes...");
  
  await prisma.promoCode.upsert({
    where: { code: 'JOIN5' },
    update: { freeOrdersCount: 5 },
    create: {
      code: 'JOIN5',
      freeOrdersCount: 5,
      maxUses: 1000
    }
  });

  await prisma.promoCode.upsert({
    where: { code: 'FREE10' },
    update: { freeOrdersCount: 10 },
    create: {
      code: 'FREE10',
      freeOrdersCount: 10,
      maxUses: 500
    }
  });

  console.log("Seed Done!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
