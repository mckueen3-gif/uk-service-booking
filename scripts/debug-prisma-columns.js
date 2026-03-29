const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function debug() {
  const variationId = 'var_demo_01';
  console.log(`Step 1: Fetching Variation ${variationId}...`);
  try {
    const v = await prisma.variation.findUnique({ where: { id: variationId } });
    console.log("Variation Found:", !!v);
    if (!v) return;

    console.log(`Step 2: Fetching Booking ${v.bookingId}...`);
    const b = await prisma.booking.findUnique({ where: { id: v.bookingId } });
    console.log("Booking Found:", !!b);
    if (!b) return;

    console.log(`Step 3: Fetching Service ${b.serviceId}...`);
    const s = await prisma.service.findUnique({ where: { id: b.serviceId } });
    console.log("Service Found:", !!s);

  } catch (err) {
    console.error("DIAGNOSTIC FAILURE:", err);
  } finally {
    process.exit();
  }
}
debug();
