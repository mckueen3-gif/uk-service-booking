const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
      ORDER BY table_name;
    `);
    console.log("=== TABLES IN DATABASE ===");
    res.rows.forEach(row => {
      console.log("- " + row.table_name);
    });
  } catch (err) {
    console.error("Error connecting to database:", err);
  } finally {
    await client.end();
  }
}

run();
