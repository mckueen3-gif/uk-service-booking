"use server";

import { prisma } from '@/lib/prisma';

export async function getReplyDrafts(reviewId: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { error: "API Key missing" };

  const review = await (prisma.review as any).findUnique({
    where: { id: reviewId },
    select: { comment: true, rating: true }
  });

  if (!review) return { error: "Review not found" };

  const prompt = `
    A customer left a ${review.rating}-star review for a UK service provider:
    "${review.comment}"
    
    Generate 3 distinct reply drafts for the merchant:
    1. "Professional": Focus on excellence and resolution (if negative) or brand reputation (if positive).
    2. "Warm": Friendly, grateful, and community-focused.
    3. "Short": Concise and straight to the point.
    
    Return as a JSON object with keys: "professional", "warm", "short".
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
      drafts: {
        professional: aiResponse.professional,
        warm: aiResponse.warm,
        short: aiResponse.short
      }
    };
  } catch (error) {
    console.error("AI Draft Generation failed:", error);
    return { error: "Failed to generate drafts" };
  }
}
