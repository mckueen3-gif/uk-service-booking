const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  console.log('--- Resilient Data Prep Start ---');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

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

  const customer = await prisma.user.upsert({
    where: { email: 'customer_test@example.com' },
    update: {},
    create: { email: 'customer_test@example.com', name: 'Test Customer', role: 'CUSTOMER', password: 'password123' }
  });

  const edu = await setupMerchant('merchant_edu@example.com', 'Elite Academy', 'Education', 'Core Math', 100);
  const repair = await setupMerchant('merchant_repair@example.com', 'Quick Plumb', 'Repairs', 'Leak Repair', 100);
  const accounting = await setupMerchant('merchant_acc@example.com', 'Simple Tax', 'Accounting', 'Tax Filing', 100);

  console.log('Customer:', customer.id);
  console.log('Edu:', edu.merchant.id);
  console.log('Repair:', repair.merchant.id);
  console.log('Acc:', accounting.merchant.id);

  console.log('--- Data Prep Done ---');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
