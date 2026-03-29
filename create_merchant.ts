import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = "merchant_test@servicehub.co.uk";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("Test merchant already exists.");
      return;
    }

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
    console.error("Failed to create merchant:", err);
  } finally {
    // In some environments, prisma.$disconnect() might be needed for the process to exit
    process.exit(0);
  }
}

main();
