"use server";

import { prisma } from '@/lib/prisma';

export async function getPricingBenchmark(serviceName: string, city: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { error: "API Key missing" };

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
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await res.json();
    const aiResponse = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    
    return {
      benchmark: aiResponse
    };
  } catch (error) {
    console.error("AI Pricing Benchmark failed:", error);
    return { error: "Failed to fetch pricing information" };
  }
}
