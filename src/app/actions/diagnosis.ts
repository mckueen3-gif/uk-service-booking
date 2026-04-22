'use server';

import { prisma, safeDbQuery } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getAIDiagnosis(imageUrl: string, category: string, locale: string = 'en', description?: string, strictMode: boolean = false) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "AUTH_REQUIRED", success: false };
    }

    // 0. Get User Context (City for Market Pricing)
    const user = await safeDbQuery(() => 
      prisma.user.findUnique({
        where: { id: userId },
        select: { city: true }
      })
    );
    const userCity = user?.city || "Unknown";

    // 0. Quota Check (5 per day)
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const diagnosisCount = await safeDbQuery(() => 
      prisma.aiDiagnosis.count({
        where: { 
          userId, 
          createdAt: { gte: startOfToday } 
        }
      })
    );

    if (diagnosisCount >= 5) {
      return { 
        error: "LIMIT_REACHED", 
        success: false, 
        count: diagnosisCount,
        category 
      };
    }

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
      USER LOCATION: "${userCity}"

      STRICT DIAGNOSIS RULES:
      1. IMAGE VALIDATION: If the image is blurry, irrelevant, or shows NO obvious physical issue (e.g., just a clean pipe or wall), state "NO_VISIBLE_ISSUE" in the issue field and explain what the user should check for (sounds, moisture, temperature).
      2. REGIONAL PRICING: Provide an estimated price range for the repair in GBP (£).
      3. MARKET COMPARISON: Research (internally) and provide local market rates for "${userCity}". If "${userCity}" is unknown, use UK national averages.

      Return a JSON response ONLY:
      {
        "issue": "Specific problem in ${locale} (or NO_VISIBLE_ISSUE)",
        "suggestedFix": "Detailed professional advice in ${locale}. If NO_VISIBLE_ISSUE, suggest manual investigation steps.",
        "estimatedPriceRange": "£[Min] - £[Max]",
        "marketComparison": {
          "region": "${userCity}",
          "averageHourlyRate": "£45 - £95/hr",
          "callOutFee": "£[Value]",
          "notes": "Brief regional market insight (e.g. 'Higher callout fees in ${userCity} expected')"
        },
        "confidence": 0.85
      }
    `;

    const systemPrompt = "You are an expert AI Diagnostic Assistant for a premium UK Service Marketplace (ConciergeAI).";
    
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
    const savedDiagnosis = await safeDbQuery(() => 
      prisma.aiDiagnosis.create({
        data: {
          userId,
          imageUrl, // Now safe because frontend compresses to ~200KB
          category,
          issue: diagnosisData.issue,
          suggestedFix: diagnosisData.suggestedFix,
          estimatedPriceRange: diagnosisData.estimatedPriceRange,
          marketComparison: diagnosisData.marketComparison,
          confidence: diagnosisData.confidence,
          rawAIResponse: `${modelName}: ${rawResponse}`
        }
      })
    );

    return { 
      success: true, 
      diagnosis: savedDiagnosis, 
      provider: modelName,
      remainingUses: 5 - (diagnosisCount + 1)
    };
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
        const diagnoses = await safeDbQuery(() => 
            prisma.aiDiagnosis.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        );
        return { diagnoses };
    } catch (err) {
        console.error("Get Recent Diagnoses Error:", err);
        return { diagnoses: [] };
    }
}

export async function getAIDiagnosisCount() {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) return { count: 0 };

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    try {
        const count = await safeDbQuery(() => 
            prisma.aiDiagnosis.count({
                where: { 
                    userId: session.user.id, 
                    createdAt: { gte: startOfToday } 
                }
            })
        );
        return { count, remaining: Math.max(0, 5 - count) };
    } catch (err) {
        console.error("Get Diagnosis Count Error:", err);
        return { count: 0, remaining: 5 };
    }
}
