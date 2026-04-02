import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  if (users.length === 0) {
    console.error('No users found in database.');
    return;
  }

  const user = users[0];
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  console.log(`Successfully promoted ${user.email} (ID: ${user.id}) to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
