const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // Get a merchant and a customer
  const merchant = await prisma.merchant.findFirst();
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  
  // Find a car service
  const service = await prisma.service.findFirst({
    where: {
      OR: [
        { category: 'automotive' },
        { name: { contains: 'Car' } }
      ]
    }
  }) || await prisma.service.findFirst();

  if (!merchant || !customer || !service) {
    console.error("Missing seed data");
    return;
  }

  console.log("Creating test repair booking...");
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      merchantId: merchant.id,
      serviceId: service.id,
      status: 'CONFIRMED',
      totalAmount: 180.00,
      depositPaid: 20.00,
      vehicleMake: 'BMW',
      vehicleModel: 'M4 Competition',
      vehicleReg: 'ELITE 1',
      scheduledDate: new Date(),
    }
  });

  console.log("Created Booking ID:", booking.id);

  // Add a variation
  await prisma.variation.create({
    data: {
      bookingId: booking.id,
      amount: 65.00,
      description: "[PART] Technical Sensor Array",
      photoUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400",
      status: 'APPROVED'
    }
  });

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
