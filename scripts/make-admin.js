const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const user = await prisma.user.findFirst();
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    console.log(`Updated user ${user.email} to ADMIN`);
  } else {
    console.log('No user found');
  }
}

makeAdmin()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
