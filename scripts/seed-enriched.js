const { Client } = require('pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Starting Enriched Seeding...");

    // 1. Volt & Pipe Solutions (Plumbing/Electrical)
    const email3 = 'voltpipe@example.com';
    const userId3 = 'user_voltpipe_03';
    await client.query(`
      INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, 'MERCHANT', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `, [userId3, email3, 'Volt & Pipe Admin']);

    const merchantId3 = 'merch_voltpipe_03';
    await client.query(`
      INSERT INTO "Merchant" (id, "userId", "companyName", description, city, "isVerified", "averageRating", "totalReviews", "createdAt", "updatedAt", "completedJobsCount", "stripeAccountId")
      VALUES ($1, $2, $3, $4, $5, true, 4.7, 42, NOW(), NOW(), 12, 'acct_demo_voltpipe')
      ON CONFLICT ("userId") DO UPDATE SET "companyName" = EXCLUDED."companyName", "stripeAccountId" = 'acct_demo_voltpipe'
    `, [merchantId3, userId3, 'Volt & Pipe Solutions', 'Expert Plumbing and Electrical services across London. 專業水電工程。', 'London']);

    const services3 = [
      ['開關插座', 'Plumbing', 65.00, '專業更換插座與開關配件。Switches and sockets replacement.'],
      ['水管維修', 'Plumbing', 80.00, '緊急水管漏水與維護。Emergency plumbing repair.'],
      ['智能家居佈線', 'Plumbing', 150.00, 'Smart home wiring systems.']
    ];

    for (const s of services3) {
      const sid = `svc_vp_${Math.random().toString(36).substr(2, 5)}`;
      await client.query(`
        INSERT INTO "Service" (id, "merchantId", name, category, price, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [sid, merchantId3, s[0], s[1], s[2], s[3]]);
    }

    // 2. Update Swift & FastFix with Stripe IDs
    await client.query(`
      UPDATE "Merchant" 
      SET description = 'Expert VAT, tax and bookkeeping. 專業會計稅務與開公司服務。',
          "stripeAccountId" = 'acct_demo_swift'
      WHERE id = 'merch_swift_02'
    `);

    await client.query(`
      UPDATE "Merchant" 
      SET "stripeAccountId" = 'acct_demo_fastfix'
      WHERE id = 'merch_fastfix_01'
    `);

    // 3. Initialize Wallets for all 3 merchants
    const merchantIds = ['merch_voltpipe_03', 'merch_swift_02', 'merch_fastfix_01'];
    for (const mid of merchantIds) {
      await client.query(`
        INSERT INTO "MerchantWallet" (id, "merchantId", "totalEarned", "availableBalance", "pendingBalance", "createdAt", "updatedAt")
        VALUES ($1, $2, 0, 0, 0, NOW(), NOW())
        ON CONFLICT ("merchantId") DO NOTHING
      `, [`wallet_${mid}`, mid]);
    }

    console.log("Enriched Seeding Success!");
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await client.end();
  }
}

main();
