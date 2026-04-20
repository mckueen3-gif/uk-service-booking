'use server';

import { prisma } from '@/lib/prisma';
import { VariationStatus, DisputeStatus } from '@prisma/client';
import { updateMerchantWallet, movePendingToAvailable } from '@/lib/finance';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateAIContent } from "@/lib/ai-provider";
import { getMerchantId } from '@/lib/merchant-utils';

export async function proposeVariation(formData: FormData) {
  const bookingId = formData.get('bookingId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const description = formData.get('description') as string;
  const photoUrl = formData.get('photoUrl') as string;

  try {
    const variation = await prisma.variation.create({
      data: {
        id: `var_${Date.now()}`,
        bookingId,
        amount,
        description,
        photoUrl,
        status: VariationStatus.PENDING,
      },
    });
    return { success: true, variation };
  } catch (err) {
    console.error("Propose Variation Error:", err);
    return { error: "Failed to propose variation" };
  }
}

export async function respondToVariation(variationId: string, status: VariationStatus) {
  try {
    const { calculateCommission } = await import('@/lib/finance');
    
    const result = await prisma.$transaction(async (tx) => {
      const variation = await tx.variation.update({
        where: { id: variationId },
        data: { status },
        include: { booking: true }
      });

      if ((status as string) === 'APPROVED') {
        const { merchantPayout } = await calculateCommission(variation.booking.merchantId, variation.amount);
        
        // 1. Add to Booking Total
        await tx.booking.update({
          where: { id: variation.bookingId },
          data: { totalAmount: { increment: variation.amount } }
        });

        // 2. Add to Merchant Wallet (Pending)
        await tx.merchantWallet.upsert({
          where: { merchantId: variation.booking.merchantId },
          update: {
            pendingBalance: { increment: merchantPayout },
            totalEarned: { increment: merchantPayout }
          },
          create: {
            merchantId: variation.booking.merchantId,
            pendingBalance: merchantPayout,
            totalEarned: merchantPayout
          }
        });
      }

      if ((status as string) === 'DISPUTED') {
        await tx.dispute.create({
          data: {
            id: `dis_${Date.now()}`,
            bookingId: variation.bookingId,
            openedById: 'system',
            reason: `Customer disputed variation: ${variation.description}`,
            status: DisputeStatus.OPEN,
          },
        });
      }

      return variation;
    });

    if ((status as string) === 'DISPUTED') {
      // Trigger AI Arbiter automatically
      await runAIArbiter(variationId);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Respond Variation Error:", err);
    return { error: err.message };
  }
}

export async function runAIArbiter(variationId: string) {
  try {
    const { calculateCommission } = await import('@/lib/finance');
    
    const variation = await prisma.variation.findUnique({
      where: { id: variationId },
      include: { 
        booking: { 
          include: { 
            service: true 
          } 
        } 
      },
    });

    if (!variation || !variation.photoUrl) return { error: "Variation or photo not found" };

    const prompt = `
      You are an expert impartial AI Arbiter for UK Service Marketplace.
      A merchant is performing a "${variation.booking.service.name}" service.
      They proposed an additional charge of £${variation.amount} for: "${variation.description}".

      ADR POLICY (ARBITRATION RULES):
      1. LABOR COST (人工費用): If the work involves manual labor (installation, repair, etc.) and it's confirmed done, the Labor portion should be honored (FORCE_PAYOUT).
      2. MATERIAL COST (材料費用): Check if the material price mentioned in "${variation.description}" is reasonable/fair for the UK market (e.g. B&Q, Screwfix rates).
      3. If materials are overpriced but labor is done, recommend SPLIT_COST or a partial pay.
      4. If the work was necessary due to "Aging/Broken hardware" found during service (Professional reasoning), lean FORCE_PAYOUT.

      Return a JSON response ONLY:
      {
        "decision": "FORCE_PAYOUT" | "REFUND_CUSTOMER" | "SPLIT_COST",
        "adjustedAmount": number (The final amount to be paid for this variation. If FORCE_PAYOUT, this matches original £${variation.amount}),
        "reasoning": "Professional explanation in Traditional Chinese and English. Explain the Labor vs Material breakdown.",
        "confidence": 0.0-1.0
      }
    `;

    // Fetch image
    const imageResp = await fetch(variation.photoUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = imageResp.headers.get("Content-Type") || "image/jpeg";

    const responseText = await generateAIContent({
      prompt,
      image: { base64: base64Image, mimeType },
      jsonMode: true
    });

    const decision = JSON.parse(responseText.replace(/```json|```/g, "").trim());

    // Final amount to add
    const finalVariationAmount = decision.decision === 'REFUND_CUSTOMER' ? 0 : (decision.adjustedAmount || variation.amount);

    // Map AI Decision to Variation Status
    let newStatus: VariationStatus = VariationStatus.DISPUTED;
    if (decision.decision === 'FORCE_PAYOUT' || decision.decision === 'SPLIT_COST') {
      newStatus = VariationStatus.APPROVED;
    } else if (decision.decision === 'REFUND_CUSTOMER') {
      newStatus = VariationStatus.REJECTED;
    }

    // Update Variation, Dispute, Booking & Wallet in a single transaction
    await prisma.$transaction(async (tx) => {
      await tx.variation.update({
        where: { id: variationId },
        data: { 
            status: newStatus,
            amount: finalVariationAmount 
        }
      });

      await tx.dispute.update({
        where: { bookingId: variation.bookingId },
        data: {
          status: DisputeStatus.RESOLVED,
          aiDecision: decision.decision,
          aiReasoning: decision.reasoning,
        },
      });

      if (finalVariationAmount > 0) {
        const { merchantPayout } = await calculateCommission(variation.booking.merchantId, finalVariationAmount);

        // Update Booking totals
        await tx.booking.update({
          where: { id: variation.bookingId },
          data: {
            totalAmount: { increment: finalVariationAmount }
          }
        });

        // Update Merchant Wallet (Escrow Pending Balance)
        await tx.merchantWallet.upsert({
          where: { merchantId: variation.booking.merchantId },
          update: {
            pendingBalance: { increment: merchantPayout },
            totalEarned: { increment: merchantPayout }
          },
          create: {
            merchantId: variation.booking.merchantId,
            pendingBalance: merchantPayout,
            totalEarned: merchantPayout,
            availableBalance: 0
          }
        });
      }
    });

    return { success: true, decision };
  } catch (err) {
    console.error("AI Arbiter Error:", err);
    return { error: "AI Arbitration failed" };
  }
}

export async function getBookingVariations(bookingId: string) {
  try {
    const variations = await prisma.variation.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, variations };
  } catch (err) {
    console.error("Get Variations Error:", err);
    return { error: "Failed to fetch variations" };
  }
}

export async function getDisputes() {
  const merchantId = await getMerchantId();

  const disputes = await prisma.dispute.findMany({
    where: {
      OR: [
        { booking: { customerId: session.user.id } },
        { booking: { merchantId: merchantId || 'non-existent' } }
      ],
      status: 'RESOLVED'
    },
    include: {
      booking: {
        include: {
          service: { select: { name: true } },
          customer: { select: { name: true } },
          merchant: { select: { companyName: true } },
          variations: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return { success: true, disputes };
}
