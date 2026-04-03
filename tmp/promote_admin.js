const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteAdmin() {
  const targetEmail = "mckueen3@gmail.com"; // 假設您的管理員信箱
  try {
    const updatedUser = await prisma.user.updateMany({
      where: { 
        email: { equals: targetEmail, mode: 'insensitive' } 
      },
      data: {
        role: "ADMIN"
      }
    });
    console.log(`--- Promotion Success ---`);
    console.log(`Updated ${updatedUser.count} users to ADMIN.`);
    
    // 同時查詢目前的 ADMIN 清單
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true, role: true }
    });
    console.log("Current Admins:", admins);
  } catch (e) {
    console.error("Error promoting user:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin();
