const { Client } = require('pg');
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Seeding Demo Variation...");

    const bookingId = 'book_v2'; // 開關插座
    const variationId = 'var_demo_01';

    // Clear old variations for this booking
    await client.query('DELETE FROM "Variation" WHERE "bookingId" = $1', [bookingId]);

    await client.query(`
      INSERT INTO "Variation" (id, "bookingId", amount, description, "photoUrl", status, "createdAt", "updatedAt")
      VALUES ($1, $2, 200.00, '發現主牆線路老化，人工更換費 £50，阻燃電線材料費 £150', 'https://picsum.photos/seed/electrician/800/600', 'PENDING', NOW(), NOW())
    `, [variationId, bookingId]);

    console.log(`Success! Seeded pending variation for booking ${bookingId}.`);
  } catch (err) {
    console.error("Variation Seeding Error:", err);
  } finally {
    await client.end();
  }
}
main();
