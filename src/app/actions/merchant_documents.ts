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

  revalidatePath('/merchant/verification');
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
      Task: Analyze the technical license (${doc.type}) strictly.
      CURRENT DATE: ${new Date().toISOString().split('T')[0]}
      
      Instructions:
      1. Identify if this is a genuine UK Gas Safe, NICEIC, or Public Liability document.
      2. Verify the issuing body to ensure it is a recognized UK authority. Reject documents from non-UK jurisdictions.
      3. Extract the Registration Number/Policy Number.
      4. Extract the Expiry Date (YYYY-MM-DD).
      5. Explicitly determine if the document is EXPIRED based on the current date.
      6. Compare the name on the certificate with "${doc.merchant.companyName}" or "${doc.merchant.user.name}".
      
      Respond in JSON format only:
      {
        "isValid": boolean (true only if UK legal, genuine, and matched),
        "isExpired": boolean,
        "issuingAuthority": "string",
        "country": "string",
        "registrationNumber": "string",
        "expiryDate": "YYYY-MM-DD",
        "confidence": float (0-1),
        "analysis": "Brief reasoning in Traditional Chinese and English focusing on UK legality and expiration",
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

    // Update Document Status (Tri-State Logic + Expiry Check)
    const isExpired = aiOutput.isExpired || (aiOutput.expiryDate && new Date(aiOutput.expiryDate) < new Date());
    const isUKDocument = aiOutput.country?.toUpperCase().includes('UK') || 
                         aiOutput.country?.toUpperCase().includes('UNITED KINGDOM') ||
                         ['GAS_SAFE', 'NICEIC'].includes(doc.type);

    let status: 'APPROVED' | 'UNDER_ADMIN_REVIEW' | 'PENDING' | 'REJECTED' | 'EXPIRED' = 'PENDING';
    
    if (aiOutput.isValid && aiOutput.nameMatch && !isExpired && isUKDocument) {
      if (aiOutput.confidence > 0.9) {
        status = 'APPROVED';
      } else if (aiOutput.confidence > 0.6) {
        status = 'UNDER_ADMIN_REVIEW'; // Needs Human Eye
      }
    } else if (isExpired) {
      status = 'EXPIRED';
    } else {
      status = 'REJECTED';
    }
    
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
    let notifTitle = "⚠️ 資質審核狀態更新";
    let notifMessage = "您的證照已上傳，系統正在處理中。";
    let notifType = "INFO";

    if (status === 'APPROVED') {
      notifTitle = "✅ 資質審核自動通過";
      notifMessage = `您的 ${doc.type} 證照已通過 AI 自動審核。`;
      notifType = "SUCCESS";
    } else if (status === 'UNDER_ADMIN_REVIEW') {
      notifTitle = "⚖️ 轉交人工專員覆核";
      notifMessage = `您的 ${doc.type} 證照已進入最終人工覆核階段，預計 24 小時內完成。`;
      notifType = "WARNING";
    } else if (status === 'EXPIRED') {
      notifTitle = "⚠️ 證照已過期";
      notifMessage = `系統檢測到您的 ${doc.type} 已經過期，請上傳最新的有效文件。`;
      notifType = "ALERT";
    } else {
      notifTitle = "❌ 證照審核失敗";
      notifMessage = `您的 ${doc.type} 未通過英國合法性審核。原因：${aiOutput.analysis}`;
      notifType = "ALERT";
    }

    await createNotification({
      userId: doc.merchant.userId,
      title: notifTitle,
      message: notifMessage,
      type: notifType as any,
      link: '/merchant/verification'
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
