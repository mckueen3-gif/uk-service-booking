const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFix() {
  const inputMerchantId = 'cmo0edn7o000vcsuh1yxgdxxp'; // The ID from the URL
  const inputServiceId = 'cmo0edn8g000wcsuh5jy3vd8t';

  console.log('--- Testing API Fix Logic ---');

  // BEFORE FIX logic:
  // const merchantFail = await prisma.merchant.findUnique({ where: { userId: inputMerchantId } });
  
  // AFTER FIX logic:
  console.log(`Checking merchant with id: ${inputMerchantId}...`);
  const merchant = await prisma.merchant.findUnique({
    where: { id: inputMerchantId }
  });

  if (!merchant) {
    console.log('❌ Still failing to find merchant by id!');
  } else {
    console.log('✅ Successfully found merchant by id:');
    console.log(`   Company: ${merchant.companyName}`);
    console.log(`   Stripe Account: ${merchant.stripeAccountId}`);
    
    if (merchant.stripeAccountId) {
      console.log('✅ Merchant is ready for Stripe Checkout.');
    } else {
      console.log('❌ Merchant lacks a Stripe Account ID.');
    }
  }

  console.log(`Checking service with id: ${inputServiceId}...`);
  const service = await prisma.service.findUnique({
    where: { id: inputServiceId }
  });

  if (!service) {
    console.log('❌ Service not found!');
  } else {
    console.log('✅ Service found:', service.name);
    console.log(`   Price: ${service.price}`);
  }
}

testFix().catch(console.error).finally(() => prisma.$disconnect());
