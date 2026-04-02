'use server';

import { prisma } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getAIDiagnosis(imageUrl: string, category: string, locale: string = 'en', description?: string, strictMode: boolean = false) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    // 1. Prepare Image Data (Base64 is required for both Gemini and Grok)
    let base64Image;
    let mimeType = "image/jpeg";

    if (imageUrl.startsWith('data:')) {
      const parts = imageUrl.split(',');
      base64Image = parts[1];
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) mimeType = mimeMatch[1];
    } else {
      const imageResp = await fetch(imageUrl);
      if (!imageResp.ok) throw new Error("Failed to fetch image from URL");
      const buffer = await imageResp.arrayBuffer();
      base64Image = Buffer.from(buffer).toString('base64');
    }

    // 2. Call Unified AI Provider (Grok Primary, Gemini Fallback with Retries)
    let diagnosisData: any = null;
    let modelName = "unknown";
    let rawResponse = "";

    const prompt = `
      Analyze the provided image(s) of a "${category}" issue.
      USER DESCRIPTION: "${description || "No description provided"}"

      TASK:
      1. Identify the specific problem/issue visible in the photo.
      2. Suggest a professional fix or necessary next steps.
      3. Estimate a UK-based repair price range in GBP (£). 
      4. Provide a confidence score (0.0 to 1.0).

      Return a JSON response ONLY:
      {
        "issue": "Specific problem in ${locale}",
        "suggestedFix": "Detailed professional advice in ${locale}",
        "estimatedPriceRange": "£150 - £250",
        "confidence": 0.85
      }
    `;

    const systemPrompt = "You are an expert AI Diagnostic Assistant for a premium UK Service Marketplace (ServiceHub).";
    
    const responseText = await generateAIContent({
      prompt,
      systemPrompt,
      image: { base64: base64Image, mimeType },
      jsonMode: true,
      strictMode: strictMode
    });

    diagnosisData = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    modelName = "coordinated-ai";
    rawResponse = responseText;

    // 4. Save to database
    const savedDiagnosis = await prisma.aiDiagnosis.create({
      data: {
        userId,
        imageUrl,
        category,
        issue: diagnosisData.issue,
        suggestedFix: diagnosisData.suggestedFix,
        estimatedPriceRange: diagnosisData.estimatedPriceRange,
        confidence: diagnosisData.confidence,
        rawAIResponse: `${modelName}: ${rawResponse}`
      }
    });

    return { success: true, diagnosis: savedDiagnosis, provider: modelName };
  } catch (err: any) {
    console.error("AI Diagnosis Error:", err);
    // Be more descriptive about the failure
    const errorPrefix = "AI 診斷暫時無法使用：";
    let details = err.message;
    
    return { 
      error: `${errorPrefix}${details}`,
      errorType: err.name,
      suggestion: "請嘗試重新整理頁面 (Ctrl+F5) 並稍後再試。" 
    };
  }
}

export async function getRecentDiagnoses() {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) return { diagnoses: [] };

    try {
        const diagnoses = await prisma.aiDiagnosis.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return { diagnoses };
    } catch (err) {
        console.error("Get Recent Diagnoses Error:", err);
        return { diagnoses: [] };
    }
}
