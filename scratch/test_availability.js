const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const merchantId = 'cmo0edn7o000vcsuh1yxgdxxp';
  const dateStr = '2026-04-17';
  
  try {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); 
    console.log('Testing slots for Merchant:', merchantId, 'on Date:', dateStr, '(Day of week:', dayOfWeek, ')');

    // 1. Check MerchantAvailability
    console.log('Checking MerchantAvailability...');
    const availability = await prisma.merchantAvailability.findUnique({
      where: { merchantId_dayOfWeek: { merchantId, dayOfWeek } }
    });
    console.log('Availability:', availability);

    // 2. Check Merchant
    console.log('Checking Merchant...');
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    });
    console.log('Merchant found:', !!merchant);

    if (!merchant) {
      console.log('Merchant NOT FOUND');
      return;
    }

    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23,59,59,999);

    // 3. Fetch Bookings
    console.log('Checking Bookings...');
    const bookings = await prisma.booking.findMany({
      where: {
        merchantId,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELLED' }
      }
    });
    console.log('Bookings count:', bookings.length);

    // 4. Fetch Custom Overrides
    console.log('Checking Custom Overrides...');
    const customArr = await prisma.merchantScheduleSlot.findMany({
      where: { merchantId, date: { gte: startOfDay, lte: endOfDay } }
    });
    console.log('Custom slots count:', customArr.length);

    console.log('Test completed successfully');
  } catch (err) {
    console.error('ERROR during test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
