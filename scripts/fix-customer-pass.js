const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const connectionString = 'postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  const hashed = await bcrypt.hash('Password123!', 10);
  await client.query('UPDATE "User" SET password = $1, "emailVerified" = NOW() WHERE email = $2', [hashed, 'demo_customer@example.com']);
  await client.end();
  console.log('Customer credentials updated');
}
run();
