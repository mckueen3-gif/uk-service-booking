"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function generateProjectDescription(title: string, category?: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { error: "API Key missing" };

  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const prompt = `
    You are a professional copywriting assistant for UK service providers (mechanics, plumbers, etc.).
    Write a short, high-impact project description (3-4 sentences) for a portfolio entry.
    Focus on quality, expertise, and customer satisfaction.
    
    Project Title: "${title}"
    Category: "${category || 'General Service'}"
    
    Format:
    - Sentence 1: The problem solved or the specific task performed.
    - Sentence 2: The expert techniques or high-quality parts used.
    - Sentence 3: The professional result or long-term benefit for the customer.
    
    Language: Traditional Chinese (for the main description) but keep technical terms if needed.
    Output: Only the 3-4 sentence description.
  `;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 暫時無法生成描述。";
    
    return { success: true, description: description.trim() };
  } catch (error) {
    console.error("AI Project Description generation failed:", error);
    return { error: "Failed to generate description" };
  }
}
