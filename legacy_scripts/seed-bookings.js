const { Client } = require('pg');
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Seeding Sample Bookings...");

    // 1. Create a Test Customer if not exists
    const customerId = 'user_customer_demo_01';
    await client.query(`
      INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
      VALUES ($1, 'demo_customer@example.com', 'Alex Smith', 'CUSTOMER', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `, [customerId]);

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    await client.query(`
      UPDATE "User" SET password = $1, "emailVerified" = NOW() WHERE id = 'user_voltpipe_03'
    `, [hashedPassword]);

    const merchantId = 'merch_voltpipe_03';
    
    // Clear old bookings for this merchant to avoid clutter
    await client.query('DELETE FROM "Booking" WHERE "merchantId" = $1', [merchantId]);

    // 2. Sample Bookings
    const sampleBookings = [
      { id: 'book_v1', service: '水管維修', price: 80.00, status: 'COMPLETED', offset: -2 },
      { id: 'book_v2', service: '開關插座', price: 65.00, status: 'CONFIRMED', offset: 1 },
      { id: 'book_v3', service: '智能家居佈線', price: 150.00, status: 'PENDING', offset: 3 },
    ];

    let pendingTotal = 0;
    let availableTotal = 0;

    for (const b of sampleBookings) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + b.offset);

      const platformFee = b.price * 0.12;
      const merchantAmount = b.price * 0.88;

      // Find a service ID for this merchant and name
      const svcRes = await client.query('SELECT id FROM "Service" WHERE "merchantId" = $1 AND name = $2 LIMIT 1', [merchantId, b.service]);
      const serviceId = svcRes.rows[0]?.id || `svc_mock_${b.id}`;

      await client.query(`
        INSERT INTO "Booking" (id, "customerId", "merchantId", "serviceId", "scheduledDate", status, "totalAmount", "platformFee", "merchantAmount", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      `, [b.id, customerId, merchantId, serviceId, scheduledDate, b.status, b.price, platformFee, merchantAmount]);

      if (b.status === 'COMPLETED') {
        availableTotal += merchantAmount;
      } else if (b.status !== 'CANCELLED') {
        pendingTotal += merchantAmount;
      }
    }

    // 3. Update Wallet
    await client.query(`
      UPDATE "MerchantWallet"
      SET "pendingBalance" = $1, "availableBalance" = $2, "totalEarned" = $2
      WHERE "merchantId" = $3
    `, [pendingTotal, availableTotal, merchantId]);

    console.log(`Success! Seeded ${sampleBookings.length} bookings for Volt & Pipe.`);
  } catch (err) {
    console.error("Booking Seeding Error:", err);
  } finally {
    await client.end();
  }
}
main();
