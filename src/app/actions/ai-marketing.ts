"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAdCopy(merchantName: string, category: string, reviews: any[], siteUrl: string) {
  try {
    const prompt = `
      Create 3 high-impact, professional social media ad headlines and short body text for a top-tier service professional on the "ConciergeAI" platform.
      
      Merchant Name: ${merchantName}
      Category: ${category}
      Reviews: ${reviews.map(r => r.content).join(", ") || "No reviews yet, focus on quality and reliability."}
      Platform: ConciergeAI
      Target Audience: UK Homeowners and Businesses looking for premium, verified experts.

      Return the result as a JSON object with this structure:
      {
        "ads": [
          {
            "headline": "...",
            "body": "...",
            "targetPlatform": "Instagram/LinkedIn"
          }
        ]
      }
      
      Make the tone "Elite", "High-Trust", and "Tech-Forward". Use British English spelling.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Simple JSON extraction from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { ads: [] };
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return { error: "Failed to generate AI copy" };
  }
}
