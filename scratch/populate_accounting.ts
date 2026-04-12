import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Adding Accounting Specialist data...");
  
  // Find a test merchant
  const merchant = await prisma.merchant.findFirst({
    where: { companyName: { contains: 'Test' } }
  });

  if (!merchant) {
    console.error("No test merchant found to assign accounting services to.");
    return;
  }

  console.log(`Assigning Accounting service to merchant: ${merchant.companyName}`);

  // Add the Accounting service
  await prisma.service.create({
    data: {
      name: "Professional UK Ledger & Personal Tax Audit",
      description: "Expert assistance for small businesses and sole traders including VAT returns and year-end audits.",
      price: 450,
      category: "ACCOUNTING",
      merchantId: merchant.id
    }
  });

  console.log("Data population complete! Search for 'Accounting' should now return results.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
