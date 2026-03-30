'use server';

import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getAIDiagnosis(imageUrl: string, category: string, description?: string) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    // Use Gemini 1.5 Flash for speed and multi-modal capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      You are an expert AI Diagnostic Assistant for a premium UK Service Marketplace (ServiceHub).
      Analyze the provided image(s) of a "${category}" issue.
      
      USER DESCRIPTION: "${description || "No description provided"}"

      TASK:
      1. Identify the specific problem/issue visible in the photo.
      2. Suggest a professional fix or necessary next steps.
      3. Estimate a UK-based repair price range in GBP (£). 
         - Factor in UK labor rates (approx £40-£80/hr depending on trade and location).
         - Factor in common parts costs in the UK (e.g., Screwfix/B&Q prices).
         - Provide a range like "£150 - £250".
      4. Provide a confidence score (0.0 to 1.0).

      IMPORTANT: Be professional, concise, and helpful. 

      Return a JSON response ONLY (no markdown blocks or preamble):
      {
        "issue": "Specific problem identified",
        "suggestedFix": "Detailed professional advice",
        "estimatedPriceRange": "£X - £Y",
        "confidence": 0.85
      }
    `;

    // Fetch image and convert to base64
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

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: mimeType } },
    ]);

    const text = result.response.text();
    // Clean up potential markdown JSON blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const diagnosisData = JSON.parse(jsonStr);

    // Save to database
    const savedDiagnosis = await prisma.aiDiagnosis.create({
      data: {
        userId,
        imageUrl,
        category,
        issue: diagnosisData.issue,
        suggestedFix: diagnosisData.suggestedFix,
        estimatedPriceRange: diagnosisData.estimatedPriceRange,
        confidence: diagnosisData.confidence,
        rawAIResponse: text
      }
    });

    return { success: true, diagnosis: savedDiagnosis };
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
