const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log("Creating Test Users...");
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Customer
  const customer = await prisma.user.upsert({
    where: { email: 'test_customer@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'test_customer@example.com',
      password: hashedPassword,
      name: 'Test Customer',
      role: 'USER',
      referralCode: 'REF123',
      referralCredits: 25.50
    }
  });

  // 2. Merchant
  const merchantUser = await prisma.user.upsert({
    where: { email: 'test_merchant@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'test_merchant@example.com',
      password: hashedPassword,
      name: 'Test Merchant Pro',
      role: 'MERCHANT'
    }
  });

  // 3. Merchant Profile
  const merchant = await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: { isVerified: true },
    create: {
      userId: merchantUser.id,
      companyName: 'Premium Service Ltd',
      isVerified: true,
      averageRating: 4.9,
      totalReviews: 42,
      stripeAccountId: 'acct_test_123',
      wallet: {
        create: {
          availableBalance: 2450.75,
          pendingBalance: 320.00
        }
      }
    }
  });

  // 4. Sample Booking for Customer
  await prisma.booking.create({
    data: {
      customerId: customer.id,
      merchantId: merchant.id,
      serviceId: (await prisma.service.findFirst())?.id || "clp...", // Fallback or find real
      status: 'PENDING',
      totalAmount: 85.00,
      scheduledDate: new Date(),
    }
  });

  console.log("SUCCESS: Created test_customer@example.com & test_merchant@example.com (pass: password123)");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
