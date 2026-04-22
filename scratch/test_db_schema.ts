import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userId = "cluy2sh18000008l1e2z5g4o9"; // Use a real ID or create one
  
  // Ensure user has a city
  await prisma.user.update({
    where: { id: userId },
    data: { city: "London" }
  });

  console.log("Updated user city to London.");

  // Note: We can't easily run the 'server action' here due to next-auth session requirements
  // But we can verify the schema and data structure
  const testInfo = await prisma.aiDiagnosis.create({
    data: {
      userId,
      imageUrl: "https://example.com/leak.jpg",
      category: "Plumbing",
      issue: "Burst pipe",
      suggestedFix: "Tighten valve",
      estimatedPriceRange: "£80 - £120",
      marketComparison: {
        region: "London",
        averageHourlyRate: "£85/hr",
        callOutFee: "£60",
        notes: "Central London premium rates apply."
      },
      confidence: 0.9
    }
  });

  console.log("Success! Saved diagnosis with market comparison:", testInfo.marketComparison);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
