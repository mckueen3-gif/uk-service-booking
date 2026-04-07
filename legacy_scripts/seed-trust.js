const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Trust & Reputation Data...");

  // 1. Find a merchant (or create one)
  let merchant = await prisma.merchant.findFirst({
    where: { companyName: { contains: "Boiler" } }
  });

  if (!merchant) {
    console.log("Creating sample merchant...");
    const user = await prisma.user.create({
      data: {
        email: `boiler-pro-${Date.now()}@example.com`,
        name: "John Boiler",
        role: "MERCHANT",
        password: "hashed_password"
      }
    });

    merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        companyName: "London Boiler Experts",
        description: "20+ years of experience in gas heating and plumbing. AI-Verified Gas Safe professional.",
        city: "London",
        isVerified: true,
        averageRating: 4.8,
        totalReviews: 2
      }
    });
  }

  // 2. Add AI-Verified Documents (using bracket notation for dynamic models if not in types)
  console.log("Adding verified documents...");
  const docModel = prisma.merchantDocument || prisma['merchantDocument'];
  
  if (docModel) {
    await docModel.createMany({
      data: [
        {
          merchantId: merchant.id,
          type: 'GAS_SAFE',
          status: 'APPROVED',
          registrationNumber: 'GS123456',
          expiryDate: new Date('2027-12-31'),
          fileUrl: 'https://images.unsplash.com/photo-1581094751100-2d93e1858c89'
        },
        {
          merchantId: merchant.id,
          type: 'PUBLIC_LIABILITY',
          status: 'APPROVED',
          registrationNumber: 'INS-9988-77',
          expiryDate: new Date('2026-06-30'),
          fileUrl: 'https://images.unsplash.com/photo-1450101496173-ee41af75d6d4'
        }
      ]
    });
  }

  // 3. Add Sample Reviews
  console.log("Adding customer reviews...");
  // Find ANY customer
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (customer && merchant) {
    await prisma.review.createMany({
      data: [
        {
          merchantId: merchant.id,
          customerId: customer.id,
          rating: 5,
          comment: "非常專業！師傅準時到達，很快就修好了我的鍋爐。大推！",
          sentiment: 'POSITIVE'
        },
        {
          merchantId: merchant.id,
          customerId: customer.id,
          rating: 4,
          comment: "價格透明，服務態度很好。雖然稍微晚了10分鐘，但技術沒話說。",
          sentiment: 'POSITIVE'
        }
      ]
    });
  }

  console.log("✅ Trust data seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
