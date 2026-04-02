"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { DisputeStatus, ResolutionDecision, Role } from "@prisma/client";

/**
 * Ensures the user is an admin
 */
async function ensureAdmin() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Fetch all disputes for admin review
 */
export async function getAdminDisputes() {
  await ensureAdmin();

  return await prisma.dispute.findMany({
    include: {
      booking: {
        include: {
          customer: true,
          merchant: true,
          service: true,
          variations: true,
        }
      },
      evidence: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get individual dispute details
 */
export async function getDisputeDetails(disputeId: string) {
  await ensureAdmin();

  return await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      booking: {
        include: {
          customer: true,
          merchant: true,
          service: true,
          variations: true,
        }
      },
      evidence: true
    }
  });
}

/**
 * Manually override the AI decision or set a resolution with financial impact
 */
export async function overrideDisputeDecision(
  disputeId: string, 
  decision: ResolutionDecision,
  adminNotes: string
) {
  await ensureAdmin();

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update Dispute record
    const dispute = await tx.dispute.update({
      where: { id: disputeId },
      include: { booking: { include: { variations: true, merchant: true } } },
      data: {
        aiDecision: decision,
        aiReasoning: `[ADMIN OVERRIDE]: ${adminNotes}`,
        status: DisputeStatus.RESOLVED,
        updatedAt: new Date()
      }
    });

    // 2. Identify relevant variation (usually the PENDING one that caused the dispute)
    const variation = dispute.booking.variations.find(v => v.status === 'PENDING' || v.status === 'REJECTED' || v.status === 'DISPUTED');

    if (variation) {
      if (decision === ResolutionDecision.FORCE_PAYOUT) {
        // Approve variation -> Merchant wins
        await (tx as any).variation.update({
          where: { id: variation.id },
          data: { status: 'APPROVED' }
        });
      } else if (decision === ResolutionDecision.REFUND_CUSTOMER) {
        // Reject variation -> Customer wins
        await (tx as any).variation.update({
          where: { id: variation.id },
          data: { status: 'REJECTED' }
        });
      } else if (decision === ResolutionDecision.SPLIT_COST) {
        // Special case: Compromise (currently marks as approved but maybe with a note or adjustment)
        await (tx as any).variation.update({
          where: { id: variation.id },
          data: { status: 'APPROVED', description: `${variation.description} (SPLIT_COST OVERRRIDE)` }
        });
      }
    }

    // 3. Send Notifications
    await Promise.all([
      createNotification({
        userId: dispute.booking.customerId,
        title: "⚖️ 爭議仲裁結果 (管理員覆核)",
        message: `管理員已針對您的預約裁定為：${decision}。${adminNotes}`,
        type: 'ALERT',
        link: `/dashboard/disputes/${dispute.id}`
      }),
      createNotification({
        userId: dispute.booking.merchant.userId,
        title: "⚖️ 爭議仲裁結果 (管理員覆核)",
        message: `管理員已針對您的爭議裁定為：${decision}。${adminNotes}`,
        type: 'ALERT',
        link: `/dashboard/disputes/${dispute.id}`
      })
    ]);

    return dispute;
  });

  // Revalidate paths
  revalidatePath("/admin/disputes");
  revalidatePath(`/admin/disputes/${disputeId}`);
  revalidatePath("/dashboard"); 

  return { success: true, dispute: result };
}

import { createNotification } from "./notifications";
import { DocumentStatus } from "@prisma/client";

/**
 * Update dispute status (e.g., mark as REVIEWING)
 */
export async function updateDisputeStatus(disputeId: string, status: DisputeStatus) {
  await ensureAdmin();

  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status }
  });

  revalidatePath("/admin/disputes");
  return { success: true };
}

/**
 * Manually review and approve/reject merchant documents (e.g. Insurance, Gas Safe)
 */
export async function reviewMerchantDocument(
  documentId: string,
  status: DocumentStatus,
  adminNotes: string
) {
  await ensureAdmin();

  const doc = await (prisma as any).merchantDocument.update({
    where: { id: documentId },
    data: { 
      status,
      aiAnalysis: `[ADMIN REVIEW]: ${adminNotes}`
    },
    include: { merchant: true }
  });

  // If a critical document is approved, we check if we should mark merchant as verified
  if (status === DocumentStatus.APPROVED) {
    if (doc.type === 'GAS_SAFE' || doc.type === 'NICEIC' || doc.type === 'PUBLIC_LIABILITY') {
      await prisma.merchant.update({
        where: { id: doc.merchantId },
        data: { isVerified: true }
      });
    }
  }

  // Notify the merchant
  await createNotification({
    userId: doc.merchant.userId,
    title: status === DocumentStatus.APPROVED ? "✅ 證照審核通過 (人工)" : "❌ 證照審核未通過",
    message: status === DocumentStatus.APPROVED 
      ? `您的 ${doc.type} 證照已通過管理員人工審查。您的帳號現已進入激活狀態。`
      : `您的 ${doc.type} 證照未能通過管理員覆核：${adminNotes}`,
    type: status === DocumentStatus.APPROVED ? 'SUCCESS' : 'ALERT'
  });

  revalidatePath("/admin/merchants");
  return { success: true };
}
