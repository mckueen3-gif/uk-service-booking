"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function fetchBusinessInfoWithAI(url: string) {
  if (!url) return { error: "Please provide a valid URL." };

  try {
    // In a real scenario, we'd scrape the URL first. 
    // For this prototype, we'll ask Gemini to "simulate" extraction or just use the URL to guess.
    const prompt = `Based on the website URL "${url}", please provide a professional guess for:
    1. Business Name (Formal)
    2. A professional 2-sentence bio for a service booking platform.
    3. Suggested Sector (One of: automotive, home_services, professional, beauty, education, health).

    Return JSON format: { "businessName": "...", "bio": "...", "sector": "..." }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from markdown if exists
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Onboarding Error:", error);
    return { 
      error: "AI could not reach the website. Please fill in manually.",
      businessName: url.replace(/(https?:\/\/)?(www\.)?/, "").split('.')[0], // fallback
      bio: "Expert provider of quality services."
    };
  }
}
