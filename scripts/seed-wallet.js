const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Wallet Rewards & Vouchers...");

  // 1. Create a Test Voucher
  const voucherCode = "WELCOME5";
  const voucherModel = prisma.voucher || prisma['voucher'];
  
  if (voucherModel) {
    const voucher = await voucherModel.upsert({
      where: { code: voucherCode },
      update: {},
      create: {
        code: voucherCode,
        value: 5.00,
        isRedeemed: false,
        expiryDate: new Date('2027-01-01')
      }
    });
    console.log(`Created voucher: ${voucher.code} (£${voucher.value})`);
  }

  // 2. Add mock transactions for a sample customer
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (customer) {
    console.log(`Adding mock transactions for ${customer.name}...`);
    const txModel = prisma.creditTransaction || prisma['creditTransaction'];
    
    if (txModel) {
      // Clear old mock data if needed
      await txModel.deleteMany({ where: { userId: customer.id } });

      await txModel.createMany({
        data: [
          {
            userId: customer.id,
            amount: 10.00,
            type: 'EARNED_REFERRAL',
            description: "推薦好友 'Sarah J.' 完成首筆預約"
          },
          {
            userId: customer.id,
            amount: -2.50,
            type: 'SPENT_BOOKING',
            description: "預約 '廚房漏水維修' 時折抵"
          },
          {
            userId: customer.id,
            amount: 5.00,
            type: 'VOUCHER_REDEEM',
            description: "兌換優惠碼: PROMO2025"
          }
        ]
      });
      
      // Update user balance to match
      await prisma.user.update({
        where: { id: customer.id },
        data: { referralCredits: 12.50 }
      });
    }
  }

  console.log("✅ Wallet data seeded successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
