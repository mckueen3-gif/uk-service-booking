import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for 'ACCOUNTING' services...");
  const services = await prisma.service.findMany({
    where: { category: 'ACCOUNTING' },
    include: { merchant: true }
  });
  
  if (services.length === 0) {
    console.log("No services found in 'ACCOUNTING' category.");
  } else {
    console.log(`Found ${services.length} accounting services:`);
    services.forEach(s => {
      console.log(`- ${s.name} (Merchant: ${s.merchant?.companyName || 'Unknown'})`);
    });
  }

  const allCategories = await prisma.service.groupBy({
    by: ['category'],
    _count: { id: true }
  });
  console.log("\nAll service categories in DB:");
  allCategories.forEach(c => {
    console.log(`- ${c.category}: ${c._count.id}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
