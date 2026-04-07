const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting Complete Dispute Simulation...");
  // ... rest of the code remains the same but using the commonJS require pattern if needed

  try {
    // 1. Find or create a Merchant
    let merchant = await prisma.merchant.findFirst();
    if (!merchant) {
       console.log("Creating dummy merchant...");
       const user = await prisma.user.create({
         data: {
           email: `merchant_${Date.now()}@example.com`,
           name: "London Fix-It Professionals",
           role: 'MERCHANT'
         }
       });
       merchant = await prisma.merchant.create({
         data: {
           userId: user.id,
           companyName: "London Fix-It",
           city: "London",
           isVerified: true
         }
       });
    }

    // 2. Find or create a Customer
    let customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    if (!customer) {
       console.log("Creating dummy customer...");
       customer = await prisma.user.create({
         data: {
           email: `customer_${Date.now()}@example.com`,
           name: "Alice Smith",
           role: 'CUSTOMER'
         }
       });
    }

    // 3. Find or create a Service
    let service = await prisma.service.findFirst({ where: { merchantId: merchant.id } });
    if (!service) {
      service = await prisma.service.create({
        data: {
          merchantId: merchant.id,
          name: "Emergency Boiler Repair",
          category: "Plumbing",
          price: 120.00
        }
      });
    }

    // 4. Create a Booking
    const bookingId = `book_sim_${Date.now()}`;
    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerId: customer.id,
        merchantId: merchant.id,
        serviceId: service.id,
        scheduledDate: new Date(),
        status: 'CONFIRMED',
        totalAmount: 120.00,
        merchantAmount: 100.00,
        platformFee: 20.00
      }
    });
    console.log(`✅ Created Booking: ${bookingId}`);

    // 5. Create a Variation (the cause of dispute)
    const variation = await prisma.variation.create({
      data: {
        id: `var_sim_${Date.now()}`,
        bookingId: booking.id,
        amount: 150.00,
        description: "Found severe internal corrosion in the heat exchanger while flushing. Full replacement required to prevent CO leak. (發現熱交換器嚴重鏽蝕，需完整更換以防止一氧化碳外洩。)",
        photoUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop",
        status: 'DISPUTED'
      }
    });
    console.log(`✅ Created Disputed Variation: ${variation.id}`);

    // 6. Create the Dispute record
    const dispute = await prisma.dispute.create({
      data: {
        id: `dis_sim_${Date.now()}`,
        bookingId: booking.id,
        openedById: customer.id,
        reason: "The technician quoted £120 initially. Now they want another £150. This feels like price gouging after the boiler is already taken apart. (師傅最初報價 £120，現在又要 £150。鍋爐已經拆開了這感覺像坐地起價。)",
        status: 'OPEN'
      }
    });
    console.log(`✅ Created Dispute: ${dispute.id}`);

    // 7. Add an Evidence entry linked to the photo
    await prisma.evidence.create({
      data: {
        disputeId: dispute.id,
        uploadedById: merchant.id,
        fileUrl: variation.photoUrl,
        type: 'IMAGE',
        description: "Photo of the corroded component found during disassembly."
      }
    });
    console.log(`✅ Evidence Linked.`);

    console.log("\n--- SIMULATION COMPLETE ---");
    console.log(`DISPUTE ID: ${dispute.id}`);
    console.log(`View it at: http://localhost:3000/dashboard/disputes/${dispute.id}`);
    console.log("Next Step: Run AI Arbiter from the dashboard (Arbiter Now button).");

  } catch (err) {
    console.error("Simulation Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
