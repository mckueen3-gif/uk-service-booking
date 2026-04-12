const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function verify() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Verification Summary ---');

  // Education Verification
  const eduMerchantId = 'cmnvu192g00025cuha1j2t9vj';
  const eduBooking = await prisma.booking.findFirst({
    where: { merchantId: eduMerchantId },
    orderBy: { createdAt: 'desc' },
    include: { merchant: { include: { wallet: true } } }
  });

  if (eduBooking) {
    console.log('Education Booking Found:', eduBooking.id);
    console.log('Status:', eduBooking.status);
    console.log('Amount:', eduBooking.totalAmount);
    console.log('Merchant Wallet Pending Balance:', eduBooking.merchant.wallet.pendingBalance);
  } else {
    console.log('ERROR: Education Booking NOT Found');
  }

  // Repairs Verification
  const repairMerchantId = 'cmnvu199a00065cuhu8qhv5ak';
  const repairBooking = await prisma.booking.findFirst({
    where: { merchantId: repairMerchantId },
    orderBy: { createdAt: 'desc' },
    include: { merchant: { include: { wallet: true } } }
  });

  if (repairBooking) {
    console.log('Repair Booking Found:', repairBooking.id);
    console.log('Status:', repairBooking.status);
    console.log('Amount:', repairBooking.totalAmount);
    console.log('Merchant Wallet Available Balance:', repairBooking.merchant.wallet.availableBalance);
    console.log('Merchant Wallet Pending Balance:', repairBooking.merchant.wallet.pendingBalance);
  } else {
    console.log('ERROR: Repair Booking NOT Found');
  }

  // Accounting Verification
  const accMerchantId = 'cmnvu19fv000a5cuhff99ngq8';
  const accBooking = await prisma.booking.findFirst({
    where: { merchantId: accMerchantId },
    orderBy: { createdAt: 'desc' },
    include: { merchant: { include: { wallet: true } } }
  });
  if (accBooking) {
    console.log('Accounting Booking Found:', accBooking.id);
    console.log('Status:', accBooking.status);
  }

  await prisma.$disconnect();
  await pool.end();
}

verify().catch(console.error);
