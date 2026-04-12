const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function finalizeAll() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('--- Finalizing All E2E Bookings (Clean) ---');

  const eduMerchantId = 'cmnvu192g00025cuha1j2t9vj';
  const repairMerchantId = 'cmnvu199a00065cuhu8qhv5ak';
  const accMerchantId = 'cmnvu19fv000a5cuhff99ngq8';

  const merchantIds = [eduMerchantId, repairMerchantId, accMerchantId];

  for (const mid of merchantIds) {
    const booking = await prisma.booking.findFirst({
      where: { merchantId: mid },
      orderBy: { createdAt: 'desc' }
    });

    if (booking) {
      console.log(`Processing Booking: ${booking.id} for Merchant: ${mid}`);
      
      // Update to COMPLETED
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED' }
      });
      console.log(`  -> Status: COMPLETED`);

      // Update Wallet
      const wallet = await prisma.merchantWallet.findUnique({ where: { merchantId: mid } });
      if (wallet) {
        if (mid === eduMerchantId) {
          // Education: Funds stay in pending due to cooling off
          console.log(`  -> Wallet: Pending balance remains £${wallet.pendingBalance} (Cooling Off)`);
        } else {
          // Others: Move from pending to available
          await prisma.merchantWallet.update({
            where: { id: wallet.id },
            data: {
              availableBalance: { increment: wallet.pendingBalance },
              pendingBalance: 0
            }
          });
          console.log(`  -> Wallet: Moved £${wallet.pendingBalance} to Available`);
        }
      }
    }
  }

  console.log('--- E2E Orchestration Done ---');
  await prisma.$disconnect();
  await pool.end();
}

finalizeAll().catch(console.error);
