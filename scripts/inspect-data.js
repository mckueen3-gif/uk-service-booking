const { Client } = require('pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const res = await client.query('SELECT DISTINCT category FROM "Service"');
    console.log("CATEGORIES_IN_DB_START");
    console.log(JSON.stringify(res.rows, null, 2));
    console.log("CATEGORIES_IN_DB_END");

    const merchants = await client.query('SELECT "companyName", "isVerified" FROM "Merchant"');
    console.log("MERCHANTS_IN_DB_START");
    console.log(JSON.stringify(merchants.rows, null, 2));
    console.log("MERCHANTS_IN_DB_END");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
