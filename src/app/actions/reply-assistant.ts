"use server";

import { prisma } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';

export async function getReplyDrafts(reviewId: string) {

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
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });

    const aiResponse = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    
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
