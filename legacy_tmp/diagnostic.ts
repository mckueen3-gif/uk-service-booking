import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Scanning Users ---");
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, referralCode: true }
  });
  
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error);
