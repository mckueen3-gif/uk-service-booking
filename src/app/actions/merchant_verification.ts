"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { authOptions } from "@/lib/auth";
import { getMerchantId } from '@/lib/merchant-utils';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { generateAIContent } from "@/lib/ai-provider";
import { saveFileLocally } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

export async function submitDocumentForVerification(fileUrl: string, type: DocumentType) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error("Merchant profile not found");

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId }
  });

  if (!merchant) throw new Error("Merchant profile not found");

  // 1. Handle File Persistence
  const persistedUrl = fileUrl.startsWith('data:') 
    ? await saveFileLocally(fileUrl, 'credentials')
    : fileUrl;

  // 2. Create the pending document record
  const doc = await (prisma as any).merchantDocument.create({
    data: {
      merchantId: merchant.id,
      fileUrl: persistedUrl,
      type,
      status: DocumentStatus.PENDING
    }
  });

  // 3. Trigger AI Vision Analysis
  try {
    let base64Image: string;
    let mimeType: string;

    if (persistedUrl.startsWith('/uploads/')) {
       // Load from local disk for AI processing
       const filePath = path.join(process.cwd(), 'public', persistedUrl);
       const buffer = fs.readFileSync(filePath);
       base64Image = buffer.toString('base64');
       // Determine mime type from extension
       const ext = path.extname(filePath).toLowerCase();
       mimeType = ext === '.pdf' ? 'application/pdf' : `image/${ext.replace('.', '') || 'jpeg'}`;
    } else {
       // Remote fetch for existing URLs (Legacy or External)
       const imageResp = await fetch(fileUrl);
       const buffer = await imageResp.arrayBuffer();
       base64Image = Buffer.from(buffer).toString('base64');
       mimeType = imageResp.headers.get("Content-Type") || "image/jpeg";
    }

    const prompt = `
        You are an expert UK Compliance Auditor. Analyze this document strictly:
        TYPE: ${type}
        CURRENT DATE: ${new Date().toISOString().split('T')[0]}
        
        Task:
        1. Confirm if this is a genuine, valid ${type} certificate.
        2. Verify if the issuing authority is a recognized UK body (e.g., Gas Safe Register, NICEIC, UK Insurance Provider). 
        3. Documents from irrelevant or non-UK jurisdictions must be marked as invalid for this technical sector.
        4. Extract the Registration Number/Policy Number.
        5. Extract the Expiry Date (YYYY-MM-DD).
        6. Determine if the document is EXPIRED based on the current date provided above.
        7. Check if the name on the document matches or is significantly related to "${merchant.companyName}".
        8. Identify any signs of placeholders, sample templates, or obvious manipulations.
        
        Return JSON ONLY:
        {
          "isValid": boolean (true only if UK legal, genuine, and matched),
          "isExpired": boolean,
          "issuingAuthority": "string",
          "country": "string",
          "registrationNumber": "string",
          "expiryDate": "YYYY-MM-DD" | null,
          "reasoning": "A concise explanation in Traditional Chinese & English focusing on UK legality and expiration",
          "confidence": 0.0-1.0
        }
      `;

    const responseText = await generateAIContent({
      prompt,
      image: { base64: base64Image, mimeType },
      jsonMode: true
    });

    const analysis = JSON.parse(responseText.replace(/```json|```/g, "").trim());

    // 3. Double-check Expiry Server-side (Override AI if needed)
    const isExpired = analysis.isExpired || (analysis.expiryDate && new Date(analysis.expiryDate) < new Date());
    const isUKDocument = analysis.country?.toUpperCase().includes('UK') || 
                         analysis.country?.toUpperCase().includes('UNITED KINGDOM') ||
                         ['GAS_SAFE', 'NICEIC'].includes(type); // These are UK specific by nature

    let status: DocumentStatus = DocumentStatus.REJECTED;
    if (analysis.isValid && !isExpired && isUKDocument) {
      if (analysis.confidence >= 0.9) {
        status = DocumentStatus.APPROVED;
      } else if (analysis.confidence >= 0.6) {
        status = DocumentStatus.UNDER_ADMIN_REVIEW;
      }
    } else if (isExpired) {
      status = DocumentStatus.EXPIRED;
    }
    
    const isApproved = status === DocumentStatus.APPROVED;
    
    await (prisma as any).merchantDocument.update({
      where: { id: doc.id },
      data: {
        status: status,
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
  const merchantId = await getMerchantId();
  if (!merchantId) return null;

  return await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: {
      documents: {
        orderBy: { updatedAt: 'desc' }
      }
    }
  });
}
