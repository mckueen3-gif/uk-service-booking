const { Client } = require('pg');
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Creating MerchantWallet table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS "MerchantWallet" (
          "id" TEXT NOT NULL,
          "merchantId" TEXT NOT NULL,
          "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "availableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "pendingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "MerchantWallet_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "MerchantWallet_merchantId_key" ON "MerchantWallet"("merchantId");
    `);

    console.log("Success! MerchantWallet table created.");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.end();
  }
}
main();
