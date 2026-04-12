require('dotenv').config();
import { prisma } from '../src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: 'tester'
      }
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true
    }
  });
  console.log('Tested Users:', JSON.stringify(users, null, 2));

  const merchants = await prisma.merchant.findMany({
    include: {
      services: true
    }
  });
  console.log('Merchants with Services:', JSON.stringify(merchants, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await (prisma as any).$disconnect());
