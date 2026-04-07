const { Client } = require('pg');

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log("Starting Raw SQL seeding...");

    // 1. FastFix Auto London
    const email1 = 'fastfix@example.com';
    const userId1 = 'user_fastfix_01';
    
    await client.query(`
      INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, 'MERCHANT', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [userId1, email1, 'FastFix Auto']);

    const merchantId1 = 'merch_fastfix_01';
    await client.query(`
      INSERT INTO "Merchant" (id, "userId", "companyName", description, city, "isVerified", "averageRating", "totalReviews", "createdAt", "updatedAt", "completedJobsCount")
      VALUES ($1, $2, $3, $4, $5, true, 4.8, 24, NOW(), NOW(), 0)
      ON CONFLICT ("userId") DO UPDATE SET "companyName" = EXCLUDED."companyName"
      RETURNING id
    `, [merchantId1, userId1, 'FastFix Auto London', 'Professional car repair and MOT services in London.', 'London']);

    // Services for FastFix
    const services1 = [
      ['MOT Test', 'Automotive', 54.85, 'Standard UK MOT test.'],
      ['Full Service', 'Automotive', 189.00, 'Comprehensive car service.'],
      ['Brake Repair', 'Automotive', 120.00, 'Front/Rear brake discs.']
    ];

    for (const s of services1) {
      const sid = `svc_ff_${s[0].toLowerCase().replace(/ /g, '_')}`;
      await client.query(`
        INSERT INTO "Service" (id, "merchantId", name, category, price, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [sid, merchantId1, s[0], s[1], s[2], s[3]]);
    }

    // 2. Swift Accounting UK
    const email2 = 'swift@example.com';
    const userId2 = 'user_swift_02';

    await client.query(`
      INSERT INTO "User" (id, email, name, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, 'MERCHANT', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    `, [userId2, email2, 'Swift Admin']);

    const merchantId2 = 'merch_swift_02';
    await client.query(`
      INSERT INTO "Merchant" (id, "userId", "companyName", description, city, "isVerified", "averageRating", "totalReviews", "createdAt", "updatedAt", "completedJobsCount")
      VALUES ($1, $2, $3, $4, $5, true, 4.9, 12, NOW(), NOW(), 0)
      ON CONFLICT ("userId") DO UPDATE SET "companyName" = EXCLUDED."companyName"
    `, [merchantId2, userId2, 'Swift Accounting UK', 'Expert VAT, tax and bookkeeping for small businesses.', 'Manchester']);

    // Services for Swift
    const services2 = [
      ['VAT Return', 'Accounting', 150.00, 'Quarterly VAT filing for MTD.'],
      ['Self Assessment', 'Accounting', 250.00, 'Personal tax return filing.'],
      ['Bookkeeping', 'Accounting', 80.00, 'Xero/Quickbooks management.']
    ];

    for (const s of services2) {
      const sid = `svc_sw_${s[0].toLowerCase().replace(/ /g, '_')}`;
      await client.query(`
        INSERT INTO "Service" (id, "merchantId", name, category, price, description, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [sid, merchantId2, s[0], s[1], s[2], s[3]]);
    }

    console.log("Seeding Success!");
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await client.end();
  }
}

main();
