const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { name: 'HHI KWAN' },
          { email: { contains: 'gmail.com', mode: 'insensitive' } }
        ]
      }
    });
    console.log("--- User Record Found ---");
    console.log(JSON.stringify(user, null, 2));
  } catch (e) {
    console.error("Error querying database:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
