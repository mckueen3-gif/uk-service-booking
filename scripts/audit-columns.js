const { Client } = require('pg');
const connectionString = 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  
  const tables = ['Variation', 'Booking', 'Service'];
  for (const table of tables) {
    const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}' ORDER BY column_name`);
    console.log(`--- ${table} ---`);
    res.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
  }
  
  await client.end();
}
run();
