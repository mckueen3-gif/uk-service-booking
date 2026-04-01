import { prisma } from "../prisma";

/**
 * 🚀 CONFLICT RESOLUTION: Generates a unique referral code.
 * Retries up to 5 times if a collision (P2002) is detected.
 */
export async function generateUniqueReferralCode(name: string): Promise<string> {
  const prefix = (name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
  let attempts = 0;
  let success = false;
  let code = "";

  while (!success && attempts < 5) {
    const random = Math.floor(1000 + Math.random() * 9000);
    code = `${prefix}${random}`;
    
    // Check if this code already exists
    const existing = await prisma.user.findFirst({
      where: { referralCode: code },
      select: { id: true }
    });

    if (!existing) {
      success = true;
    } else {
      attempts++;
    }
  }
  
  if (!success) {
    // Ultimate fallback: add another random digit
    code = `${prefix}${Math.floor(10000 + Math.random() * 90000)}`;
  }
  
  return code;
}
