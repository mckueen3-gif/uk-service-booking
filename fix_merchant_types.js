const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Fixing Merchant Business Types ---');

  const merchants = await prisma.merchant.findMany();
  
  for (const m of merchants) {
    let type = 'Specialist';
    const name = m.companyName?.toLowerCase() || '';

    if (name.includes('plumb') || name.includes('gas')) type = 'Plumbing';
    else if (name.includes('tutor') || name.includes('academy')) type = 'Education';
    else if (name.includes('tax') || name.includes('accounting') || name.includes('accountant')) type = 'Accounting';
    else if (name.includes('legal') || name.includes('law') || name.includes('advice')) type = 'Legal';
    else if (name.includes('fixer') || name.includes('repair')) type = 'Repairs';
    else if (name.includes('build') || name.includes('design') || name.includes('renovate')) type = 'Renovation';

    console.log(`Updating ${m.companyName}: Setting type to ${type}`);
    
    await prisma.merchant.update({
      where: { id: m.id },
      data: { businessType: type }
    });
  }

  console.log('--- Fix Complete ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
