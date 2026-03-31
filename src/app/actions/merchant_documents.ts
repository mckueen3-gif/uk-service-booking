"use server";

import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';
import { generateAIContent } from '@/lib/ai-provider';
import { createNotification } from './notifications';

/**
 * Merchant uploads a professional license for verification.
 */
export async function uploadMerchantDocument(type: 'GAS_SAFE' | 'NICEIC' | 'PUBLIC_LIABILITY', fileUrl: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { error: "Merchant profile not found" };

  const document = await (prisma.merchantDocument as any).create({
    data: {
      merchantId: merchant.id,
      type,
      fileUrl,
      status: 'PENDING'
    }
  });

  // Automatically trigger AI Audit
  processLicenseWithAI(document.id);

  revalidatePath('/dashboard/merchant/verification');
  return { success: true, documentId: document.id };
}

/**
 * AI Audit for UK Technical Licenses (Gas Safe / NICEIC)
 */
export async function processLicenseWithAI(documentId: string) {
  const doc = await (prisma.merchantDocument as any).findUnique({
    where: { id: documentId },
    include: { merchant: { include: { user: true } } }
  });

  if (!doc || !doc.fileUrl) return;

  try {
    // Fetch image
    const response = await fetch(doc.fileUrl);
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const prompt = `
      You are an expert UK Compliance Auditor for a Service Marketplace.
      Task: Analyze the attached image for a technical license (${doc.type}).
      
      Instructions:
      1. Identify if this is a genuine Gas Safe, NICEIC, or Public Liability document.
      2. Extract the Registration Number/Policy Number.
      3. Extract the Expiry Date (Format: YYYY-MM-DD).
      4. Compare the name on the certificate with "${doc.merchant.companyName}" or "${doc.merchant.user.name}".
      
      Respond in JSON format only:
      {
        "isValid": boolean,
        "registrationNumber": "string",
        "expiryDate": "YYYY-MM-DD",
        "confidence": float (0-1),
        "analysis": "Brief reasoning in Traditional Chinese and English",
        "nameMatch": boolean
      }
    `;

    const aiOutputText = await generateAIContent({
      prompt,
      image: {
        base64: base64Image,
        mimeType: "image/jpeg"
      },
      jsonMode: true
    });

    const aiOutput = JSON.parse(aiOutputText.replace(/```json|```/g, "").trim());

    // Update Document Status
    const status = (aiOutput.confidence > 0.8 && aiOutput.isValid && aiOutput.nameMatch) ? 'APPROVED' : 'PENDING';
    
    await (prisma.merchantDocument as any).update({
      where: { id: documentId },
      data: {
        status,
        registrationNumber: aiOutput.registrationNumber,
        expiryDate: aiOutput.expiryDate ? new Date(aiOutput.expiryDate) : null,
        aiAnalysis: aiOutput.analysis,
        confidence: aiOutput.confidence
      }
    });

    // Send Notification to Merchant
    await createNotification({
      userId: doc.merchant.userId,
      title: status === 'APPROVED' ? "✅ 資質審核通過" : "⚠️ 資質審核需要人工覆核",
      message: status === 'APPROVED' ? `您的 ${doc.type} 證照已通過 AI 自動審核並更新狀態。` : `您的 ${doc.type} 已上傳，AI 無法完全辨識，將由專員在 24 小時內覆核。`,
      type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
      link: '/dashboard/merchant/verification'
    });

    // If Gas Safe/NICEIC is approved, mark merchant as partially verified
    if (status === 'APPROVED' && (doc.type === 'GAS_SAFE' || doc.type === 'NICEIC')) {
       await prisma.merchant.update({
         where: { id: doc.merchantId },
         data: { isVerified: true }
       });
    }

  } catch (err) {
    console.error("AI Document Audit Error:", err);
  }
}

/**
 * Get merchant documents
 */
export async function getMerchantDocuments() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) return { error: "Merchant profile not found" };

  const documents = await (prisma as any).merchantDocument.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: 'desc' }
  });

  return { documents };
}
