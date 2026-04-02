"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Utility to ensure only ADMIN can run these actions
async function ensureAdmin() {
  const session = await getServerSession();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function verifyMerchantDocument(documentId: string, status: "APPROVED" | "REJECTED" | "UNDER_ADMIN_REVIEW") {
  await ensureAdmin();

  try {
    const document = await prisma.merchantDocument.update({
      where: { id: documentId },
      data: { status },
      include: { merchant: true }
    });

    // Automatically check if all required documents belong to this merchant are approved
    // If so, we might want to flag the merchant as verified (or leave it to manual toggle)
    
    revalidatePath("/admin/verifications");
    return { success: true, message: `Document updated to ${status}.` };
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Failed to update document status." };
  }
}

export async function toggleMerchantVerification(merchantId: string, isVerified: boolean) {
  await ensureAdmin();

  try {
    await prisma.merchant.update({
      where: { id: merchantId },
      data: { isVerified }
    });

    revalidatePath("/admin/merchants");
    revalidatePath("/admin/verifications");
    return { success: true, message: `Merchant verification status set to ${isVerified}.` };
  } catch (error) {
    console.error("Merchant toggle error:", error);
    return { success: false, message: "Failed to update merchant status." };
  }
}

export async function processWithdrawal(requestId: string, status: "APPROVED" | "REJECTED" | "COMPLETED", adminNotes?: string) {
  await ensureAdmin();

  try {
    const request = await prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: { 
        status, 
        adminNotes 
      },
      include: { merchant: { include: { wallet: true } } }
    });

    // Logic for deducting from availableBalance could go here if status === 'COMPLETED'
    
    revalidatePath("/admin/payouts");
    return { success: true, message: `Withdrawal request ${status}.` };
  } catch (error) {
    console.error("Withdrawal error:", error);
    return { success: false, message: "Failed to process withdrawal." };
  }
}
