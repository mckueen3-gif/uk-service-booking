const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        user: {
          select: {
            email: true,
            id: true
          }
        }
      }
    });
    console.log(JSON.stringify(merchants.map(m => ({
      id: m.id,
      company: m.companyName,
      email: m.user?.email,
      userId: m.userId
    })), null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
