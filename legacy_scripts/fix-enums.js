const { Client } = require('pg');
const connectionString = 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  try {
    // ALTER TYPE cannot be run inside a transaction in some PG versions/cloud providers for some scenarios, 
    // but here we just need to add the values.
    await client.query('ALTER TYPE "VariationStatus" ADD VALUE IF NOT EXISTS \'DISPUTED\'');
    await client.query('ALTER TYPE "DisputeStatus" ADD VALUE IF NOT EXISTS \'RESOLVED\'');
    
    // Also check for ResolutionDecision enum
    await client.query('ALTER TYPE "ResolutionDecision" ADD VALUE IF NOT EXISTS \'FORCE_PAYOUT\'');
    await client.query('ALTER TYPE "ResolutionDecision" ADD VALUE IF NOT EXISTS \'REFUND_CUSTOMER\'');
    await client.query('ALTER TYPE "ResolutionDecision" ADD VALUE IF NOT EXISTS \'SPLIT_COST\'');
    
    console.log('DB Enums Updated Successfully');
  } catch (err) {
    console.error("Enum Update Error:", err.message);
  } finally {
    await client.end();
  }
}
run();
