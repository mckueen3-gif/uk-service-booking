const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    // Find the most recent user
    const findRes = await client.query('SELECT id, email, role FROM "User" ORDER BY "createdAt" DESC LIMIT 1');
    
    if (findRes.rows.length === 0) {
      console.error('No users found.');
      return;
    }

    const user = findRes.rows[0];
    console.log(`Found user: ${user.email} (ID: ${user.id}). Current role: ${user.role}`);

    // Update to ADMIN
    await client.query('UPDATE "User" SET role = \'ADMIN\' WHERE id = $1', [user.id]);
    
    console.log(`Successfully promoted ${user.email} to ADMIN using direct SQL.`);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
}

main();
