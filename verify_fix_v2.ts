import { prisma } from './src/lib/prisma';

async function testFix() {
  const inputMerchantId = 'cmo0edn7o000vcsuh1yxgdxxp';
  const inputServiceId = 'cmo0edn8g000wcsuh5jy3vd8t';

  console.log('--- Testing API Fix Logic (Using Project Prisma) ---');

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: inputMerchantId }
    });

    if (!merchant) {
      console.log('❌ Still failing to find merchant by id!');
    } else {
      console.log('✅ Successfully found merchant by id:');
      console.log(`   Company: ${merchant.companyName}`);
      console.log(`   Stripe Account: ${merchant.stripeAccountId}`);
    }

    const service = await prisma.service.findUnique({
      where: { id: inputServiceId }
    });

    if (!service) {
      console.log('❌ Service not found!');
    } else {
      console.log('✅ Service found:', service.name);
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

testFix().catch(console.error).finally(() => prisma.$disconnect());
