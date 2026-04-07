const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const variationId = 'var_demo_01';
    console.log(`Testing respondToVariation for ID: ${variationId}...`);
    
    const variation = await prisma.variation.update({
      where: { id: variationId },
      data: { status: 'DISPUTED' }
    });
    console.log("Success! Variation updated to DISPUTED:", variation);

    console.log("Creating Dispute record...");
    const dispute = await prisma.dispute.create({
      data: {
        id: `dis_test_${Date.now()}`,
        bookingId: variation.bookingId,
        openedById: 'test_customer',
        reason: 'Test dispute',
        status: 'OPEN'
      }
    });
    console.log("Success! Dispute created:", dispute);

  } catch (err) {
    console.error("FAILURE:", err.message);
  } finally {
    process.exit();
  }
}
test();
