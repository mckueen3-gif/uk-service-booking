const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Merchant Portfolio & Bookings...");

  // 1. Find the sample merchant
  const merchant = await prisma.merchant.findFirst({
    where: { companyName: { contains: "Boiler" } }
  });

  if (!merchant) {
    console.error("❌ Merchant not found. Please run seed-trust.js first.");
    return;
  }

  // 2. Add Portfolio Items (Work Showcase)
  console.log("Adding portfolio items...");
  const portfolioModel = prisma.merchantPortfolio || prisma['merchantPortfolio'];
  if (portfolioModel) {
    await portfolioModel.deleteMany({ where: { merchantId: merchant.id } }); // Cleanup
    await portfolioModel.createMany({
      data: [
        {
          merchantId: merchant.id,
          title: "全新家用鍋爐安裝",
          description: "為位於 Croydon 的三房住宅更換節能冷凝式鍋爐，提升 30% 能源效率。",
          imageUrl: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?q=80&w=800&auto=format&fit=crop",
          category: "Boiler Installation"
        },
        {
          merchantId: merchant.id,
          title: "衛浴暗管漏水修復",
          description: "精準定位牆內漏水點，在不破壞牆面磁磚的情況下完成修補。",
          imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
          category: "Repair"
        },
        {
          merchantId: merchant.id,
          title: "瓦斯安全年度檢查",
          description: "為倫敦市中心多處公寓提供年度安全檢查，並核發證書。",
          imageUrl: "https://images.unsplash.com/photo-1621905252507-b35482cdca47?q=80&w=800&auto=format&fit=crop",
          category: "Gas Safety"
        }
      ]
    });
  }

  // 3. Add some sample real bookings for the dashboard
  console.log("Adding sample bookings...");
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  const service = await prisma.service.findFirst({ where: { merchantId: merchant.id } });

  if (customer && service) {
    await prisma.booking.createMany({
      data: [
        {
          customerId: customer.id,
          merchantId: merchant.id,
          serviceId: service.id,
          scheduledDate: new Date('2026-04-10T14:00:00'),
          status: 'PENDING',
          totalAmount: 85.0,
          platformFee: 8.5,
          merchantAmount: 76.5
        },
        {
          customerId: customer.id,
          merchantId: merchant.id,
          serviceId: service.id,
          scheduledDate: new Date('2026-03-25T09:30:00'),
          status: 'COMPLETED',
          totalAmount: 120.0,
          platformFee: 12.0,
          merchantAmount: 108.0
        }
      ]
    });
  }

  console.log("✅ Portfolio and Bookings seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
