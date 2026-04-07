import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const merchants = await prisma.merchant.findMany({
    take: 5,
    select: { id: true, companyName: true }
  })
  console.log(JSON.stringify(merchants, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
