const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Data Preparation Start ---');

  // 1. Create/Find Test Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer_test@example.com' },
    update: {},
    create: {
      email: 'customer_test@example.com',
      name: 'Test Customer',
      role: 'CUSTOMER',
      password: 'password123',
    }
  });
  console.log(`Customer: ${customer.id}`);

  // 2. Helper to Create Merchant + Service
  async function setupMerchant(email, companyName, category, serviceName, price) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'MERCHANT' },
      create: {
        email,
        name: companyName,
        role: 'MERCHANT',
        password: 'password123',
      }
    });

    const merchant = await prisma.merchant.upsert({
      where: { userId: user.id },
      update: { 
        isVerified: true, 
        stripeAccountId: 'acct_test_123'
      },
      create: {
        userId: user.id,
        companyName,
        city: 'London',
        isVerified: true,
        stripeAccountId: 'acct_test_123'
      }
    });

    // Create a service
    const service = await prisma.service.create({
      data: {
        merchantId: merchant.id,
        category,
        name: serviceName,
        price,
        description: `E2E Test ${category} Service`
      }
    });

    // Initialize Wallet
    await prisma.merchantWallet.upsert({
      where: { merchantId: merchant.id },
      update: {},
      create: { merchantId: merchant.id }
    });

    return { merchant, service };
  }

  // 3. Setup Sector Merchants
  const edu = await setupMerchant('merchant_edu@example.com', 'Elite Academy', 'Education', 'Core Math', 100);
  const repair = await setupMerchant('merchant_repair@example.com', 'Quick Plumb', 'Repairs', 'Leak Repair', 100);
  const accounting = await setupMerchant('merchant_acc@example.com', 'Simple Tax', 'Accounting', 'Tax Filing', 100);

  console.log('Edu Merchant:', edu.merchant.id, 'Service:', edu.service.id);
  console.log('Repair Merchant:', repair.merchant.id, 'Service:', repair.service.id);
  console.log('Acc Merchant:', accounting.merchant.id, 'Service:', accounting.service.id);

  console.log('--- Data Preparation Complete ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
