const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Using the same connection string from existing seed
const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const LONDON_BOROUGHS = [
    { name: 'Westminster', lat: 51.4975, lng: -0.1357 },
    { name: 'Camden', lat: 51.5290, lng: -0.1255 },
    { name: 'Greenwich', lat: 51.4892, lng: 0.0000 },
    { name: 'Hackney', lat: 51.5450, lng: -0.0553 },
    { name: 'Islington', lat: 51.5416, lng: -0.1022 },
    { name: 'Kensington', lat: 51.5020, lng: -0.1947 },
    { name: 'Lambeth', lat: 51.4607, lng: -0.1163 },
    { name: 'Southwark', lat: 51.4834, lng: -0.0821 },
    { name: 'Tower Hamlets', lat: 51.5099, lng: -0.0059 },
    { name: 'Wandsworth', lat: 51.4567, lng: -0.1910 },
    { name: 'Richmond', lat: 51.4479, lng: -0.3260 },
    { name: 'Ealing', lat: 51.5130, lng: -0.3089 }
];

async function main() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🚀 Starting UK Merchant Geographic Seeding...");

    for (let i = 0; i < LONDON_BOROUGHS.length; i++) {
        const borough = LONDON_BOROUGHS[i];
        const email = `expert_${i}@londonpro.co.uk`;
        
        // Jitter coordinates slightly for each merchant
        const lat = borough.lat + (Math.random() - 0.5) * 0.01;
        const lng = borough.lng + (Math.random() - 0.5) * 0.01;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: `Pro ${borough.name} Expert`,
                role: 'MERCHANT'
            }
        });

        const categories = ['Accounting', 'Education', 'Cleaning', 'Automotive', 'Plumbing'];
        const primaryCategory = categories[i % categories.length];
        
        const merchant = await prisma.merchant.upsert({
            where: { userId: user.id },
            update: {
                latitude: lat,
                longitude: lng,
                city: 'London'
            },
            create: {
                userId: user.id,
                companyName: primaryCategory === 'Accounting' ? `${borough.name} Tax Partners` 
                           : primaryCategory === 'Education' ? `${borough.name} Learning Academy`
                           : `${borough.name} ${primaryCategory} Pro`,
                description: primaryCategory === 'Accounting' 
                    ? `Professional ACCA regulated accounting and tax services in ${borough.name}.`
                    : primaryCategory === 'Education'
                    ? `Premier ${borough.name} tutoring center. DBS Checked and experienced mentors.`
                    : `Top-rated ${primaryCategory} services serving the ${borough.name} area.`,
                city: 'London',
                latitude: lat,
                longitude: lng,
                isVerified: true, 
                averageRating: 4.5 + Math.random() * 0.5,
                totalReviews: Math.floor(Math.random() * 80) + 20
            }
        });

        // Add specialized services based on primary category
        let servicesData = [];
        if (primaryCategory === 'Accounting') {
            servicesData = [
                { category: 'Accounting', name: 'VAT Return Filing', price: 150, description: 'Quarterly submission (MTD compliant).' },
                { category: 'Accounting', name: 'Self-Assessment', price: 195, description: 'Personal tax return filing.' },
                { category: 'Accounting', name: 'Monthly Bookkeeping', price: 85, description: 'Ongoing reconciliation (Per Month).' }
            ];
        } else if (primaryCategory === 'Education') {
            servicesData = [
                { category: 'Education', name: '1-on-1 GCSE Tutoring', price: 45, description: 'Personalized curriculum support.' },
                { category: 'Education', name: 'IELTS English Prep', price: 55, description: 'Exam focus and speaking practice.' },
                { category: 'Education', name: 'Music Lesson (60 min)', price: 40, description: 'Piano, Guitar, or Voice.' },
                { category: 'Education', name: 'Coding Bootcamp (Monthly)', price: 299, description: 'Weekend project-based learning.' }
            ];
        } else {
            servicesData = [
                { category: primaryCategory, name: `${primaryCategory} Support`, price: 50 + Math.floor(Math.random() * 50) },
                { category: primaryCategory, name: `Premium ${primaryCategory} Pack`, price: 120 + Math.floor(Math.random() * 80) }
            ];
        }

        await prisma.service.createMany({
            data: servicesData.map(s => ({ ...s, merchantId: merchant.id })),
            skipDuplicates: true
        });

        process.stdout.write('.');
    }

    console.log("\n✅ Seeding of London Geographic Data Completed!");

  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
