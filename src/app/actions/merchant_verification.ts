"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DocumentType, DocumentStatus } from '@prisma/client';
import { generateAIContent } from "@/lib/ai-provider";

export async function submitDocumentForVerification(fileUrl: string, type: DocumentType) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const merchant = await prisma.merchant.findUnique({
    where: { userId }
  });

  if (!merchant) throw new Error("Merchant profile not found");

  // 1. Create the pending document record
  const doc = await (prisma as any).merchantDocument.create({
    data: {
      merchantId: merchant.id,
      fileUrl,
      type,
      status: DocumentStatus.PENDING
    }
  });

  // 2. Trigger AI Vision Analysis
  try {
    // Fetch image
    const imageResp = await fetch(fileUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = imageResp.headers.get("Content-Type") || "image/jpeg";

    const prompt = `
      You are an expert UK Compliance Auditor. Analyze this document:
      TYPE: ${type}
      
      Task:
      1. Confirm if this is a valid ${type} certificate.
      2. Extract the Registration Number/License Number.
      3. Extract the Expiry Date (YYYY-MM-DD). If no expiry, return null.
      4. Check if the name on the document matches (or is related to) "${merchant.companyName}".
      
      Return JSON ONLY:
      {
        "isValid": boolean,
        "registrationNumber": string,
        "expiryDate": "YYYY-MM-DD" | null,
        "reasoning": "Traditional Chinese and English explanation",
        "confidence": 0.0-1.0
      }
    `;

    const responseText = await generateAIContent({
      prompt,
      image: { base64: base64Image, mimeType },
      jsonMode: true
    });

    const analysis = JSON.parse(responseText.replace(/```json|```/g, "").trim());

    // 3. Update Document with AI Results
    const isApproved = analysis.isValid && analysis.confidence > 0.7;
    
    await (prisma as any).merchantDocument.update({
      where: { id: doc.id },
      data: {
        status: isApproved ? DocumentStatus.APPROVED : DocumentStatus.REJECTED,
        registrationNumber: analysis.registrationNumber,
        expiryDate: analysis.expiryDate ? new Date(analysis.expiryDate) : null,
        aiAnalysis: analysis.reasoning,
        confidence: analysis.confidence
      }
    });

    // 4. Update overall Merchant Verification Status
    if (isApproved) {
      await prisma.merchant.update({
        where: { id: merchant.id },
        data: { isVerified: true }
      });
    }

    revalidatePath('/merchant/verification');
    return { success: true, analysis };

  } catch (err: any) {
    console.error("AI Verification Error:", err);
    return { error: "AI Analysis failed, but document submitted for manual review." };
  }
}

export async function getMerchantVerificationStatus() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userId = (session.user as any).id;
  return await prisma.merchant.findUnique({
    where: { userId },
    include: {
      documents: {
        orderBy: { updatedAt: 'desc' }
      }
    }
  });
}
