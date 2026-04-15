const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  console.log('--- RECREATE FICTIONAL MERCHANTS START ---');

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const categories = [
    { id: 'plumbing', category: 'Plumbing', company: 'Royal Plumb & Gas', service: 'Emergency Leak Repair', price: 85 },
    { id: 'repairs', category: 'Repairs', company: 'London Fixer Pro', service: 'Home Maintenance', price: 65 },
    { id: 'renovation', category: 'Renovation', company: 'Elite Build & Design', service: 'Kitchen Remodelling', price: 150 },
    { id: 'education', category: 'Education', company: 'Oxford Tutors UK', service: 'A-Level Mathematics', price: 45 },
    { id: 'accounting', category: 'Accounting', company: 'City Tax Solutions', service: 'Self Assessment Filing', price: 120 },
    { id: 'legal', category: 'Legal', company: 'Regent Legal Advice', service: 'Contract Review', price: 200 },
    { id: 'commercial', category: 'Commercial', company: 'B2B Office Solutions', service: 'Office Maintenance', price: 95 },
    { id: 'cleaning', category: 'Cleaning', company: 'Sparkle Clean London', service: 'End of Tenancy Clean', price: 110 }
  ];

  // 1. Delete all existing test/fictional merchants and users
  // We identify them by email pattern merchant_*@example.com
  console.log('Cleaning up existing mock data...');
  
  const testEmails = ['customer_test@example.com'];
  // We'll also find any users that look like merchant_.*@example.com
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'merchant_', endsWith: '@example.com' } },
        { email: { startsWith: 'customer_test', endsWith: '@example.com' } }
      ]
    },
    select: { id: true, merchantProfile: { select: { id: true } } }
  });

  const testUserIds = testUsers.map(u => u.id);
  const testMerchantIds = testUsers.filter(u => u.merchantProfile).map(u => u.merchantProfile.id);

  if (testMerchantIds.length > 0) {
      console.log(`Cleaning up records for ${testMerchantIds.length} merchants...`);
      await prisma.review.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.booking.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchantDocument.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchantPortfolio.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchantWallet.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchantAvailability.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchantScheduleSlot.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.service.deleteMany({ where: { merchantId: { in: testMerchantIds } } });
      await prisma.merchant.deleteMany({ where: { id: { in: testMerchantIds } } });
  }

  const deletedUsers = await prisma.user.deleteMany({
    where: { id: { in: testUserIds } }
  });
  console.log(`Deleted ${deletedUsers.count} fictional users/merchants.`);

  // 3. Recreate one for each category
  for (const item of categories) {
    const email = `merchant_${item.id}@example.com`;
    console.log(`Creating merchant: ${item.company} (${item.category})...`);

    const user = await prisma.user.create({
      data: {
        email,
        name: item.company,
        role: 'MERCHANT',
        password: 'password123', // Demo password
      }
    });

    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        companyName: item.company,
        city: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        description: `Premium ${item.category} services in London. Highly rated professional with years of experience.`,
        isVerified: true,
        stripeAccountId: 'acct_test_mock_' + item.id,
        averageRating: 4.8,
        totalReviews: 24,
        completedJobsCount: 150,
        ownerName: 'Alexander McQueen',
        memberSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 3), // 3 years ago
        insuranceAmount: 5000000,
        businessType: item.category === 'Plumbing' || item.category === 'Renovation' ? 'Limited Company' : 'Sole Trader',
        vatNumber: item.id === 'plumbing' || item.id === 'renovation' ? 'GB 987 6543 21' : null,
        bannerUrl: item.id === 'plumbing' ? "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop" : 
                   item.id === 'renovation' ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop" :
                   "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
        vettingChecks: {
            identityVerified: true,
            addressVerified: true,
            financialChecked: true,
            professionalReferenceChecked: true
        }
      }
    });

    // Create primary service
    const service = await prisma.service.create({
      data: {
        merchantId: merchant.id,
        category: item.category,
        name: item.service,
        price: item.price,
        description: `Professional ${item.service} provided by our expert team.`,
        isEmergencyAble: item.category === 'Plumbing' || item.category === 'Repairs'
      }
    });

    // Initialize Wallet
    await prisma.merchantWallet.create({
      data: { 
          merchantId: merchant.id,
          availableBalance: 0,
          totalEarned: 0
      }
    });

    // Add 2 portfolio items to each to fix the "Broken Images" issue with real logic
    const portfolioUrls = [
        "https://images.unsplash.com/photo-1581578731548-c744c843509c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504148455328-497c5efae156?q=80&w=800&auto=format&fit=crop"
    ];

    if (item.category === 'Education') {
        portfolioUrls[0] = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop";
        portfolioUrls[1] = "https://images.unsplash.com/photo-1523240715633-5552eb886846?q=80&w=800&auto=format&fit=crop";
    } else if (item.category === 'Accounting' || item.category === 'Legal') {
        portfolioUrls[0] = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop";
        portfolioUrls[1] = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop";
    }

    await prisma.merchantPortfolio.createMany({
        data: [
            { merchantId: merchant.id, title: 'Recent Project 1', imageUrl: portfolioUrls[0] },
            { merchantId: merchant.id, title: 'Recent Project 2', imageUrl: portfolioUrls[1] }
        ]
    });

    // Add detailed reviews with sub-ratings
    const booking1 = await prisma.booking.create({
        data: {
            customerId: user.id,
            merchantId: merchant.id,
            serviceId: service.id,
            scheduledDate: new Date(),
            status: 'COMPLETED',
            totalAmount: service.price,
            isUrgent: false
        }
    });

    const booking2 = await prisma.booking.create({
        data: {
            customerId: user.id,
            merchantId: merchant.id,
            serviceId: service.id,
            scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
            status: 'COMPLETED',
            totalAmount: service.price,
            isUrgent: false
        }
    });

    await prisma.review.createMany({
        data: [
            {
                merchantId: merchant.id,
                customerId: user.id,
                bookingId: booking1.id,
                rating: 5,
                qualityRating: 5,
                reliabilityRating: 5,
                communicationRating: 5,
                comment: 'Excellent work! Very professional and punctual.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
            },
            {
                merchantId: merchant.id,
                customerId: user.id,
                bookingId: booking2.id,
                rating: 4,
                qualityRating: 5,
                reliabilityRating: 4,
                communicationRating: 4,
                comment: 'Great service, though a bit of a delay in starting.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
            }
        ]
    });
  }

  // Record a test customer too
  await prisma.user.create({
    data: {
        email: 'customer_test@example.com',
        name: 'Test Customer',
        role: 'CUSTOMER',
        password: 'password123'
    }
  });

  console.log('--- RECREATE FICTIONAL MERCHANTS DONE ---');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
