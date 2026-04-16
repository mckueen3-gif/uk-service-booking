
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const merchantId = 'cmo0edn7o000vcsuh1yxgdxxp';
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: {
      user: true,
      conversations: {
        include: {
          customer: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  });

  console.log('Merchant:', JSON.stringify(merchant, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
