"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper to generate a unique-ish referral code
function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
}

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = (formData.get("email") as string)?.toLowerCase();
  const password = formData.get("password") as string;
  const role = formData.get("role") as "CUSTOMER" | "MERCHANT";
  const referredBy = formData.get("referredBy") as string; // Optional referral code

  if (!email || !password || !firstName || !lastName || !role) {
    return { error: "Missing required fields" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email already registered in the system" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const name = `${firstName} ${lastName}`;
  const referralCode = generateReferralCode(name);

  try {
    return await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          referralCode,
        }
      });

      // If referredBy exists, find the referrer and create the Referral record
      if (referredBy) {
        const referrer = await tx.user.findUnique({
          where: { referralCode: referredBy }
        });

        if (referrer && referrer.id !== user.id) {
          await tx.referral.create({
            data: {
              referrerId: referrer.id,
              refereeId: user.id
            }
          });
        }
      }

      // If registering as a Merchant, create the Merchant profile record
      if (role === 'MERCHANT') {
        await tx.merchant.create({
          data: {
            userId: user.id,
            companyName: name, // Default to user's name
            city: "London",    // Default starting city for UK platform
            isVerified: false,
          }
        });
      }

      return { success: true, userId: user.id };
    });
  } catch (e: any) {
    console.error("Registration error:", e);
    return { error: e.message || "Registration failed due to server error" };
  }
}

