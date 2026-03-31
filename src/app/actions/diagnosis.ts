'use server';

import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getGrokDiagnosis } from '@/lib/grok';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getAIDiagnosis(imageUrl: string, category: string, locale: string = 'en', description?: string) {
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

    let diagnosisData: any = null;
    let modelName = "unknown";
    let rawResponse = "";

    // 2. Prefer Grok if API Key is configured
    if (process.env.XAI_API_KEY) {
      console.info(`[AI Diagnosis] Attempting diagnosis with xAI Grok-2-vision...`);
      diagnosisData = await getGrokDiagnosis(
        base64Image,
        mimeType,
        category,
        description || "No description provided",
        locale
      );
      if (diagnosisData) {
        modelName = "grok-2-vision-1212";
        rawResponse = JSON.stringify(diagnosisData);
      }
    }

    // 3. Fallback to Gemini if Grok not configured or failed
    if (!diagnosisData) {
      console.info(`[AI Diagnosis] Using Gemini fallback (model: gemini-flash-latest)`);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `
        You are an expert AI Diagnostic Assistant for a premium UK Service Marketplace (ServiceHub).
        Analyze the provided image(s) of a "${category}" issue.
        USER DESCRIPTION: "${description || "No description provided"}"

        TASK:
        1. Identify the specific problem/issue visible in the photo.
        2. Suggest a professional fix or necessary next steps.
        3. Estimate a UK-based repair price range in GBP (£). 
        4. Provide a confidence score (0.0 to 1.0).

        Return a JSON response ONLY:
        {
          "issue": "Specific problem identified in ${locale}",
          "suggestedFix": "Detailed professional advice in ${locale}",
          "estimatedPriceRange": "£150 - £250",
          "confidence": 0.85
        }
      `;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Image, mimeType: mimeType } },
      ]);

      const text = result.response.text();
      const jsonStr = text.replace(/```json|```/g, "").trim();
      diagnosisData = JSON.parse(jsonStr);
      modelName = "gemini-flash-latest";
      rawResponse = text;
    }

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
    return { error: "Failed to generate AI diagnosis: " + err.message };
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
