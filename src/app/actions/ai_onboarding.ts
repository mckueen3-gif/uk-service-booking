"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function getUrlMetadata(url: string) {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'ConciergeAI-Bot/1.0' }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const html = await response.text();
    
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "";
    
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
    const description = descMatch ? descMatch[1] : "";

    return { title, description };
  } catch (error) {
    console.warn("Metadata Fetch Warning:", error);
    return null;
  }
}

export async function fetchBusinessInfoWithAI(url: string) {
  if (!url) return { error: "Please provide a valid URL." };

  const metadata = await getUrlMetadata(url);
  const context = metadata 
    ? `Title: ${metadata.title}\nDescription: ${metadata.description}`
    : `URL: ${url}`;

  const prompt = `Extract business details for URL "${url}". 
  Context: ${context}
  Return JSON: { "businessName": "...", "bio": "...", "sector": "automotive|home_services|professional|beauty|education|health" }`;

  try {
    // Attempt Gemini first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid Gemini response");
  } catch (geminiError: any) {
    console.warn("Gemini Failed, trying OpenAI...", geminiError.message);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const content = completion.choices[0].message.content;
      if (content) return JSON.parse(content);
    } catch (openaiError) {
      console.error("All AI Providers Failed:", openaiError);
    }

    // Advanced Guesser Fallback
    const guessedName = url.replace(/(https?:\/\/)?(www\.)?/, "").split('.')[0]
                           .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                           
    return { 
      error: metadata ? "AI 暫時無法解析網站內容，已為您自動填寫預測資料。" : "AI 無法連通網站，請手動輸入或檢查網址。",
      businessName: guessedName || "New Merchant",
      bio: metadata?.description || "高品質專業服務，值得信賴。",
      sector: "professional"
    };
  }
}
