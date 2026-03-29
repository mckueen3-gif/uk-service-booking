const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "merchant_test@servicehub.co.uk";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: "Volt & Pipe Admin (Test)",
        password: hashedPassword,
        role: 'MERCHANT',
        merchantProfile: {
          create: {
            companyName: "Volt & Pipe Services Ltd",
            city: "London",
            isVerified: true,
            averageRating: 4.8,
            totalReviews: 12
          }
        }
      }
    });

    console.log("Created test merchant account:", user.email);
  } catch (err) {
    if (err.code === 'P2002') {
      console.log("Test merchant already exists.");
    } else {
      console.error("Failed to create merchant:", err);
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
