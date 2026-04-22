"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { getStripeClient } from "@/lib/stripe";
import { authOptions } from "@/lib/auth";

// Utility to ensure only ADMIN can run these actions
async function ensureAdmin() {
  const session = await getServerSession(authOptions);
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

/**
 * Processes a withdrawal request.
 * If COMPLETED: Calculates Stripe fee (£0.25 + 0.25%) and performs actual Stripe Transfer.
 * If REJECTED: Returns funds to merchant's availableBalance.
 */
export async function processWithdrawal(requestId: string, status: "APPROVED" | "REJECTED" | "COMPLETED", adminNotes?: string) {
  await ensureAdmin();

  try {
    const stripe = await getStripeClient();

    // 1. Fetch current request state
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: { 
        merchant: { 
          include: { wallet: true } 
        } 
      }
    });

    if (!request) throw new Error("Withdrawal request not found");
    if (request.status === "COMPLETED") throw new Error("Request already completed");
    if (request.status === "REJECTED" && status !== "REJECTED") throw new Error("Cannot modify a rejected request");

    let transferId = request.stripeTransferId;

    // 2. Business Logic based on Target Status
    if (status === "COMPLETED") {
       if (!request.merchant.stripeAccountId) {
         return { success: false, message: "Merchant has not onboarded with Stripe." };
       }

       // Calculate Dynamic Fee: 0.25% + £0.25
       const grossAmount = request.amount;
       const dynamicFee = (grossAmount * 0.0025) + 0.25;
       const netPayout = grossAmount - dynamicFee;

       if (netPayout <= 0) {
         return { success: false, message: "Requested amount too low to cover Stripe fees." };
       }

       // Execute actual Stripe Transfer (amount in pence)
       const transfer = await stripe.transfers.create({
         amount: Math.floor(netPayout * 100),
         currency: 'gbp',
         destination: request.merchant.stripeAccountId,
         description: `Withdrawal Request ${request.id}`,
         metadata: {
           internalId: request.id,
           merchantId: request.merchantId,
           grossAmount: grossAmount.toString(),
           feeCharged: dynamicFee.toFixed(2)
         }
       });

       transferId = transfer.id;
    } 
    else if (status === "REJECTED") {
       // Refund the availableBalance since it was deducted on request creation
       await prisma.merchantWallet.update({
         where: { merchantId: request.merchantId },
         data: {
           availableBalance: { increment: request.amount } as any
         }
       });
    }

    // 3. Update Request Status
    await prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: { 
        status, 
        adminNotes,
        stripeTransferId: transferId
      }
    });

    revalidatePath("/admin/payouts");
    revalidatePath("/merchant/wallet");
    
    return { 
      success: true, 
      message: status === "COMPLETED" 
        ? `Payout of £${request.amount.toFixed(2)} processed (Transfer: ${transferId})` 
        : `Request status updated to ${status}.` 
    };
  } catch (error: any) {
    console.error("[Admin] Withdrawal processing error:", error.message);
    return { success: false, message: error.message || "Failed to process withdrawal." };
  }
}
