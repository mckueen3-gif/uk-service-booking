import { Client } from "pg";

const connectionString = "postgresql://postgres.omwmlqivzwudrzwwggsk:CnP%25_UQdpYNKa9x@aws-1-eu-central-2.pooler.supabase.com:5432/postgres";

async function main() {
  const email = "mckueen3@gmail.com";
  console.log(`\n🚀 [SQL REPAIR] Targeting User: ${email}`);
  
  const client = new Client({ connectionString });
  await client.connect();

  try {
    // 1. Find the User
    const userRes = await client.query('SELECT id, role, name FROM "User" WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user) {
      console.error("❌ Error: User not found.");
      return;
    }

    console.log(`✅ Found User ID: ${user.id} | Role: ${user.role}`);

    // 2. Fix Role if needed
    if (user.role !== "MERCHANT") {
      console.log("⚠️ Updating role to MERCHANT...");
      await client.query('UPDATE "User" SET role = \'MERCHANT\' WHERE id = $1', [user.id]);
    }

    // 3. Ensure Merchant Profile
    const merchantRes = await client.query('SELECT id FROM "Merchant" WHERE "userId" = $1', [user.id]);
    let merchantId = merchantRes.rows[0]?.id;

    if (!merchantId) {
      console.log("🚀 Creating missing Merchant profile...");
      const newMerchantRes = await client.query(
        'INSERT INTO "Merchant" (id, "userId", "companyName", city, "isVerified", "averageRating", "completedJobsCount", "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id',
        [`merchant_${Math.random().toString(36).substr(2, 9)}`, user.id, user.name || "Specialist", "London", true, 5.0, 0]
      );
      merchantId = newMerchantRes.rows[0].id;
      console.log(`✅ Created Merchant ID: ${merchantId}`);
    }

    // 4. Ensure Wallet
    const walletRes = await client.query('SELECT id FROM "MerchantWallet" WHERE "merchantId" = $1', [merchantId]);
    if (walletRes.rows.length === 0) {
      console.log("🚀 Creating missing Merchant Wallet...");
      await client.query(
        'INSERT INTO "MerchantWallet" (id, "merchantId", "totalEarned", "availableBalance", "pendingBalance", "authorizedBalance", "updatedAt", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [`wallet_${Math.random().toString(36).substr(2, 9)}`, merchantId, 0, 0, 0, 0]
      );
      console.log("✅ Wallet created in SQL.");
    } else {
      console.log("✅ Wallet already exists.");
    }

    console.log("\n✨ [SUCCESS] SQL Repair complete.");

  } catch (err) {
    console.error("❌ SQL Error:", err);
  } finally {
    await client.end();
  }
}

main();
