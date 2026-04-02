const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function elevate() {
  const client = new Client({
    connectionString: "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require",
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to DB.");

    const res = await client.query('UPDATE "User" SET role = \'ADMIN\' WHERE email = $1 RETURNING id, name, role', ['mckueen2@gmail.com']);

    if (res.rowCount === 0) {
      console.log("USER_NOT_FOUND: The email is not registered yet.");
    } else {
      console.log("ELEVATED_SUCCESSFULLY:", res.rows[0]);
    }
  } catch (err) {
    console.error("Execution failure:", err);
  } finally {
    await client.end();
  }
}

elevate();
