import { prisma } from './prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Robust helper to retrieve the current merchant ID from the session.
 * Includes a fallback to email-based lookup if the direct userId link is missing.
 */
export async function getMerchantId(): Promise<string | null> {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const email = session.user.email;

  // 1. Primary lookup by userId (Prisma unique relation)
  let merchant = await prisma.merchant.findUnique({
    where: { userId }
  });

  // 2. Secondary/Robust lookup by email if userId match failed
  // This helps recover sessions where the userId format might have shifted or missing link
  if (!merchant && email) {
    const userWithProfile = await prisma.user.findUnique({
      where: { email },
      include: { merchantProfile: true }
    });
    
    if (userWithProfile?.merchantProfile) {
      merchant = userWithProfile.merchantProfile;
      
      // OPTIONAL: Self-heal if userId mismatch found
      if (merchant.userId !== userId) {
        console.warn(`[Self-Heal] Detected userId mismatch for merchant ${merchant.id}. Updating link.`);
        try {
          await prisma.merchant.update({
            where: { id: merchant.id },
            data: { userId }
          });
        } catch (e) {
          console.error("[Self-Heal] Failed to update merchant link:", e);
        }
      }
    }
  }

  return merchant?.id || null;
}
