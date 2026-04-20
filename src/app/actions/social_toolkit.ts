"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { getMerchantId } from '@/lib/merchant-utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateSocialPost(mode: 'viral' | 'luxury', reviewId?: string) {
  const session = await getServerSession(authOptions);
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { 
        reviews: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!merchant) return { error: "Merchant not found" };

    const merchantName = merchant.companyName;
    const category = merchant.businessType;
    const refLink = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${session.user.id}?ref=${session.user.id}`;
    
    // Find specific review if requested
    const reviews = merchant.reviews as any[];
    const targetReview = reviewId 
      ? reviews.find((r: any) => r.id === reviewId)
      : reviews[0];

    const prompt = `
      You are a high-end social media growth strategist for "ConciergeAI", a premium UK-based expert services platform.
      Generate a viral social media post (caption + headline) for the expert "${merchantName}" who specializes in "${category}".

      ${targetReview ? `Base this post on this customer review: "${targetReview.content}" by ${targetReview.userName}.` : "Focus on the overall premium quality and expertise of the merchant."}

      Mode: ${mode === 'viral' ? "Viral Hype (Energetic, emoji-rich, bold hooks, results-oriented)" : "Quiet Luxury (Minimalist, sophisticated, ultra-high-end tone, authority-driven)"}
      
      Requirements:
      1. Use British English.
      2. Keep it under 280 characters for the main body if possible, or up to 500 for Instagram style.
      3. MUST naturally include this call-to-action link: ${refLink}
      4. Include 3-5 relevant hashtags.
      5. Add a "Share Prompt" for the expert (e.g., "Post this on your Instagram story with a photo of your latest job!").

      Return a JSON object:
      {
        "headline": "...",
        "caption": "...",
        "suggestedHashtags": ["...", "..."],
        "expertTip": "...",
        "platform": "WhatsApp / Instagram / LinkedIn"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { 
        ...JSON.parse(jsonMatch[0]),
        refLink
      };
    }
    
    return { error: "AI failed to format output" };
  } catch (error) {
    console.error("Social Toolkit Error:", error);
    return { error: "Failed to generate post" };
  }
}
