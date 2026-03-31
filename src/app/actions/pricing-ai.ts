"use server";

import { prisma } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';

export async function getPricingBenchmark(serviceName: string, city: string) {

  const prompt = `
    Provide current UK market pricing (GBP) for the service "${serviceName}" in the city of "${city}".
    Give 3 price points:
    1. "Low": Entry-level or independent contractor rate.
    2. "Average": Typical professional or established company rate.
    3. "High": Premium or emergency/complex service rate.
    
    Return as a JSON object with keys: "low", "average", "high", "currency" (always "GBP"), and "insight" (a one-sentence tip on why prices vary).
    JSON only:
  `;

  try {
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });

    const aiResponse = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    
    return {
      benchmark: aiResponse
    };
  } catch (error) {
    console.error("AI Pricing Benchmark failed:", error);
    return { error: "Failed to fetch pricing information" };
  }
}
