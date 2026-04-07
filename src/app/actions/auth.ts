"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail";

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
    return { error: "missingFields" };
  }

  if (password.length < 6) {
    return { error: "passwordTooShort" };
  }

  const existingUser = await prisma.user.findUnique({ 
    where: { email },
    select: { id: true, email: true } // Explicit select to bypass missing columns
  });
  if (existingUser) {
    return { error: "emailExists" };
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
          referralCode, // Re-enabled
        }
      });

      // If referredBy exists, handle safely
      if (referredBy) {
        try {
          const referrer = await tx.user.findUnique({
            where: { referralCode: referredBy },
            select: { id: true }
          });
          if (referrer && referrer.id !== user.id) {
            await tx.referral.create({
              data: { referrerId: referrer.id, refereeId: user.id }
            });
          }
        } catch (e) {
          console.error("Referral creation failed (ignored):", e);
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
    return { error: "serverError" };
  }
}

export async function requestPasswordReset(emailInput: string) {
  const email = emailInput.toLowerCase();
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true } // Explicit select
    });
    
    // For security, always return success even if user doesn't exist
    if (!user) {
      console.log(`[AUTH_LOG] Reset requested for non-existent email: ${email}`);
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.passwordResetToken.upsert({
      where: { token },
      update: { token, expires }, 
      create: {
        email,
        token,
        expires,
      }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://conciergeai.uk'}/auth/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your UK Service Hub password",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your UK Service Hub account.</p>
          <p>Click the link below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0f172a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    });

    console.log(`[AUTH_LOG] Reset link generated for ${email}: ${resetUrl}`);
    return { success: true };
  } catch (e) {
    return { error: "resetFailed" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  if (newPassword.length < 6) {
    return { error: "passwordTooShort" };
  }

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { error: "invalidReset" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { token }
      })
    ]);

    return { success: true };
  } catch (e) {
    return { error: "serverError" };
  }
}
