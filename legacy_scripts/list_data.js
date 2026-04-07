const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const merchants = await prisma.merchant.findMany({
    include: { services: true }
  });
  
  console.log('--- Merchants and Services ---');
  merchants.forEach(m => {
    console.log(`Merchant: ${m.companyName} (ID: ${m.id})`);
    m.services.forEach(s => {
      console.log(`  - Service: ${s.name} (ID: ${s.id}) [£${s.price}]`);
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
