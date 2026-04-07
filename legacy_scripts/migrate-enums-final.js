const { Client } = require('pg');
const connectionString = 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    console.log("Applying Refined Enum Migration...");

    // 1. Create Types if they don't exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "VariationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISPUTED');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      
      DO $$ BEGIN
        CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
      
      DO $$ BEGIN
        CREATE TYPE "ResolutionDecision" AS ENUM ('PENDING', 'REFUND_CUSTOMER', 'FORCE_PAYOUT', 'SPLIT_COST', 'ESCALATE_TO_HUMAN');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // 2. Drop Defaults to allow column type change
    await client.query(`
      ALTER TABLE "Variation" ALTER COLUMN "status" DROP DEFAULT;
      ALTER TABLE "Dispute" ALTER COLUMN "status" DROP DEFAULT;
      ALTER TABLE "Dispute" ALTER COLUMN "aiDecision" DROP DEFAULT;
    `);

    // 3. Convert Columns
    await client.query(`
      ALTER TABLE "Variation" ALTER COLUMN "status" TYPE "VariationStatus" USING "status"::"VariationStatus";
      ALTER TABLE "Dispute" ALTER COLUMN "status" TYPE "DisputeStatus" USING "status"::"DisputeStatus";
      ALTER TABLE "Dispute" ALTER COLUMN "aiDecision" TYPE "ResolutionDecision" USING "aiDecision"::"ResolutionDecision";
    `);

    // 4. Restore Defaults
    await client.query(`
      ALTER TABLE "Variation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
      ALTER TABLE "Dispute" ALTER COLUMN "status" SET DEFAULT 'OPEN';
      ALTER TABLE "Dispute" ALTER COLUMN "aiDecision" SET DEFAULT 'PENDING';
    `);

    console.log('Migration Completed Successfully.');
  } catch (err) {
    console.error("Migration Error:", err.message);
  } finally {
    await client.end();
  }
}
run();
