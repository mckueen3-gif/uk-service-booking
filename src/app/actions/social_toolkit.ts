"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { getMerchantId } from '@/lib/merchant-utils';
import { getServerSession } from "next-auth/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateSocialPost(mode: 'viral' | 'luxury', reviewId?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Not logged in" };
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

export async function generateOmnichannelCampaign(topic: string, discount?: string, targetAudience?: string, locale: string = "en") {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Not logged in" };
  
  const merchantId = await getMerchantId();
  if (!merchantId) return { error: "Merchant not found" };

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) return { error: "Merchant not found" };

    const merchantName = merchant.companyName;
    const category = merchant.businessType;
    const profileLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://conciergeai.uk'}/merchant/${merchantId}?ref=social`;
    
    const prompt = `
      You are the elite "Omnichannel Social Media Director" for ConciergeAI, a premium UK-based expert services platform (https://conciergeai.uk).
      The merchant "${merchantName}" (Specialty: ${category}) wants to create a promotional campaign based on the following topic/event:
      
      "${topic}"
      
      ${discount ? `Promotion/Discount: "${discount}"` : ""}
      ${targetAudience ? `Target Audience: "${targetAudience}"` : ""}

      LANGUAGE REQUIREMENT:
      - The generated copy for ALL platforms (igFbPost, xPost, redditPost) MUST be in ${locale === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'British English'}.
      - The wechatMoments post MUST be in Traditional Chinese but with a warm, personal tone.

      YOUR TASK:
      1. Generate tailored text for four distinct social networks: Instagram/Facebook, X/Twitter, Reddit, and WeChat Moments.
      2. Generate a strategic block of 5-10 HASHTAGS relevant to the service and topic to maximize SEO and discovery.
      3. For EVERY text, you MUST include a professional sign-off introducing ConciergeAI and the booking link.
         Mandatory Footer: "Professional services powered by ConciergeAI. Book me instantly at: ${profileLink} | Visit: https://conciergeai.uk"
      4. WECHAT SPECIAL INSTRUCTIONS: Use friendly, high-trust Chinese (Traditional/Simplified) suitable for a "Moments" (朋友圈) post. Focus on reliability and the platform's standard.
      5. Generate an "imagePrompt" for a high-quality, cinematic AI image generator that perfectly illustrates this topic. Include "ConciergeAI logo style" in the description.
      
      RULES FOR EACH PLATFORM:
      - igFbPost: Visual, emoji-rich, uses bullet points, high-trust.
      - xPost: Short, punchy, max 280 chars, viral style.
      - redditPost: Authentic "Story" or "AMA" style, helpful tone.
      - wechatMoments: Warm, expert, family-oriented or business-professional Chinese text.

      Return ONLY a pure JSON object:
      {
        "igFbPost": "...",
        "xPost": "...",
        "redditPost": "...",
        "wechatMoments": "...",
        "hashtags": "...",
        "imagePrompt": "..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      
      return {
        success: true,
        campaign: {
          id: Date.now().toString(),
          igFbPost: data.igFbPost,
          xPost: data.xPost,
          redditPost: data.redditPost,
          wechatMoments: data.wechatMoments || "",
          hashtags: data.hashtags || "",
          imageUrl: `https://pollinations.ai/p/${encodeURIComponent(data.imagePrompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux`,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    return { error: "AI failed to format omnichannel output" };
  } catch (error) {
    console.error("Omnichannel Campaign Error:", error);
    return { error: "Failed to generate campaign" };
  }
}

export async function publishSocialPosts(payload: any) {
  // Simulate an Ayrshare / Zapier API Webhook Call
  // In production, this would `POST` to Ayrshare's `/post` endpoint
  // with the merchant's Profile Keys.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { success: false, error: "Not logged in" };
  
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay
  
  console.log("Simulated Ayrshare Webhook Triggered:");
  console.log("Platforms:", payload.platforms);
  console.log("Media URL:", payload.imageUrl);
  
  return { 
    success: true, 
    message: "Successfully scheduled via Ayrshare",
    trackingId: "ayr_" + Math.random().toString(36).substring(7)
  };
}

export async function generateVisualPost(prompt: string, locale: string = "en") {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Not logged in" };

  try {
    const aiPrompt = `
      You are a world-class "Visual Content Director". 
      Based on this user prompt: "${prompt}", create two things:
      1. A high-conversion social media caption (British English if locale is en, Traditional Chinese if zh-TW).
      2. A descriptive AI image prompt for a cinematic, hyper-realistic photo.

      Requirements:
      - Caption: Engaging, uses emojis, includes the ConciergeAI brand vibe.
      - Image Prompt: Detailed, mentions lighting, camera angle, and "ConciergeAI style".
      
      Return JSON:
      {
        "caption": "...",
        "imagePrompt": "..."
      }
    `;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        post: {
          caption: data.caption,
          imageUrl: `https://pollinations.ai/p/${encodeURIComponent(data.imagePrompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux`
        }
      };
    }
    return { error: "AI failed to format output" };
  } catch (error) {
    console.error("Visual Magic Error:", error);
    return { error: "Failed to generate visual content" };
  }
}

/**
 * AI 優化現有文案
 */
export async function optimizeExistingContent(currentText: string, platform: string, locale: string = "en") {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return { error: "Not logged in" };

  try {
    const prompt = `
      You are an expert social media copywriter for ConciergeAI. 
      Refine and optimize the following text for the ${platform} platform.
      
      Current Text: "${currentText}"
      
      Goal: Make it more engaging, professional, and high-converting while keeping the core message and links intact.
      Language: ${locale === 'zh-TW' ? 'Traditional Chinese (繁體中文)' : 'British English'}.
      
      Return ONLY the optimized text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { success: true, optimizedText: response.text() };
  } catch (error) {
    console.error("Optimization Error:", error);
    return { error: "Failed to optimize content" };
  }
}
