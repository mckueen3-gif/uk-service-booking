const { Client } = require('pg');
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query('SELECT id, "companyName", "stripeAccountId" FROM "Merchant"');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
main();
