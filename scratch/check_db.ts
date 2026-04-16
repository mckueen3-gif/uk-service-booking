import { prisma } from '../src/lib/prisma';

async function main() {
  const id = 'cmo0edn7o000vcsuh1yxgdxxp';
  console.log(`Checking merchant with ID: ${id}`);
  
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        user: true,
        services: true,
        reviews: {
          include: { customer: true }
        }
      }
    });
    
    if (merchant) {
      console.log('--- Merchant Found ---');
      console.log('ID:', merchant.id);
      console.log('Company:', merchant.companyName);
      console.log('Owner:', merchant.ownerName);
      console.log('User Email:', merchant.user?.email);
      console.log('Verified:', merchant.isVerified);
      console.log('Services:', merchant.services.map(s => s.name).join(', '));
      
      console.log('\n--- Reviews ---');
      merchant.reviews.forEach((r, i) => {
        console.log(`Review ${i+1}:`);
        console.log(`- From: ${r.customer?.name} (ID: ${r.customerId})`);
        console.log(`- Rating: ${r.rating}`);
        console.log(`- Comment: ${r.comment}`);
      });
    } else {
      console.log('Merchant NOT found in database.');
      
      // List all merchants to see what we have
      const all = await prisma.merchant.findMany({
        take: 10,
        select: { id: true, companyName: true }
      });
      console.log('\nAvailable Merchants (first 10):');
      all.forEach(m => console.log(`- ${m.id}: ${m.companyName}`));
    }
  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
