const { Client } = require('pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"; // Use direct URL for schema investigation

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const tables = ['User', 'Merchant', 'Service'];
    for (const table of tables) {
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.log(`${table}_COLUMNS_START`);
      console.log(JSON.stringify(res.rows, null, 2));
      console.log(`${table}_COLUMNS_END`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
