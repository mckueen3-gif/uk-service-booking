"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DocumentType, DocumentStatus } from '@prisma/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Fetch image
    const imageResp = await fetch(fileUrl);
    const buffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

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

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ]);

    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(jsonStr);

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
