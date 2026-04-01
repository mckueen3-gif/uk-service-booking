import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Users named 'HHI' or similar ---");
  const users = await prisma.user.findMany({
    where: {
      name: { contains: "HHI", mode: "insensitive" }
    },
    select: { id: true, email: true, name: true, referralCode: true, role: true }
  });
  
  console.log(JSON.stringify(users, null, 2));

  // Let's also get all users just in case
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, referralCode: true, role: true }
  });
  console.log("\n--- All Users ---");
  console.log(JSON.stringify(allUsers, null, 2));
}

main().catch(console.error);
