const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const merchantId = 'merch_voltpipe_03';
    console.log("Testing Prisma query for MerchantWallet...");
    const wallet = await prisma.merchantWallet.findUnique({
      where: { merchantId }
    });
    console.log("Wallet found:", wallet);
    
    console.log("Testing Prisma query for Booking aggregation...");
    const stats = await prisma.booking.aggregate({
      where: { merchantId },
      _count: { id: true },
      _sum: { totalAmount: true }
    });
    console.log("Stats found:", stats);
    
    console.log("SUCCESS: All dashboard queries are working!");
  } catch (err) {
    console.error("FAILURE:", err.message);
  } finally {
    process.exit();
  }
}
test();
