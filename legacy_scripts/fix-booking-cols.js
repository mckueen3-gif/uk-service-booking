const { Client } = require('pg');
const connectionString = 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    console.log("Adding missing vehicle columns to Booking table...");
    await client.query(`
      ALTER TABLE "Booking" 
      ADD COLUMN IF NOT EXISTS "vehicleReg" TEXT, 
      ADD COLUMN IF NOT EXISTS "vehicleMake" TEXT, 
      ADD COLUMN IF NOT EXISTS "vehicleModel" TEXT, 
      ADD COLUMN IF NOT EXISTS "vehicleYear" TEXT, 
      ADD COLUMN IF NOT EXISTS "vehicleNotes" TEXT
    `);
    console.log('Booking Table Columns Fixed Successfully.');
  } catch (err) {
    console.error("Migration Error:", err.message);
  } finally {
    await client.end();
  }
}
run();
