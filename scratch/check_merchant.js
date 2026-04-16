const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = 'cmo0edn7o000vcsuh1yxgdxxp';
  console.log(`Checking merchant with ID: ${id}`);
  
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        user: true,
        services: true
      }
    });
    
    if (merchant) {
      console.log('Merchant found!');
      console.log('Company:', merchant.companyName);
      console.log('User Name:', merchant.user?.name);
      console.log('Services Count:', merchant.services.length);
    } else {
      console.log('Merchant NOT found in database.');
      
      // List some recent merchants to see if IDs are similar
      const recent = await prisma.merchant.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      });
      console.log('\nRecent merchants for ID pattern reference:');
      recent.forEach(m => {
        console.log(`- ID: ${m.id} | Name: ${m.companyName || m.user?.name}`);
      });
    }
  } catch (err) {
    console.error('Error connecting to DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
