const { Client } = require('pg');
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Creating Variation, Dispute, and Evidence tables...");
    
    // 1. Variation Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Variation" (
        "id" TEXT NOT NULL,
        "bookingId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "description" TEXT NOT NULL,
        "photoUrl" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, DISPUTED
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
      );
    `);

    // 2. Dispute Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Dispute" (
        "id" TEXT NOT NULL,
        "bookingId" TEXT NOT NULL,
        "openedById" TEXT NOT NULL,
        "reason" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, REVIEWING, RESOLVED
        "aiDecision" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, REFUND_CUSTOMER, FORCE_PAYOUT, SPLIT_COST
        "aiReasoning" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
      );
    `);

    // 3. Evidence Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Evidence" (
        "id" TEXT NOT NULL,
        "disputeId" TEXT NOT NULL,
        "uploadedById" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "type" TEXT NOT NULL, -- IMAGE, DOCUMENT
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
      );
    `);

    // Add unique indexes and foreign keys if not exists (simplified for raw SQL)
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "Dispute_bookingId_key" ON "Dispute"("bookingId");`);

    console.log("Success! Phase 24 database tables created.");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.end();
  }
}
main();
