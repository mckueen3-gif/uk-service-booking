"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

async function getCategoriesList() {
  try {
    const dataPath = path.join(process.cwd(), "src/data/checkatrade_categories.json");
    const content = fs.readFileSync(dataPath, "utf8");
    const json = JSON.parse(content);
    return Object.values(json).flat() as string[];
  } catch (e) {
    return ["Plumber", "Electrician", "Builder", "Handyman", "Painter & Decorator"];
  }
}

async function getUrlMetadata(url: string) {
  // ... existing implementation remains mostly the same, but let's consolidate
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

    return { title, description, rawHtml: html.substring(0, 5000) };
  } catch (error) {
    return null;
  }
}

export async function fetchBusinessInfoWithAI(url: string) {
  if (!url) return { error: "Please provide a valid URL." };

  const metadata = await getUrlMetadata(url);
  const categoriesList = await getCategoriesList();
  
  const context = metadata 
    ? `Title: ${metadata.title}\nDescription: ${metadata.description}\nContent Sample: ${metadata.rawHtml}`
    : `URL: ${url}`;

  const prompt = `Task: Analyze this business website data to extract identity and trade categories.
  Context: ${context}
  
  Available Standard Categories (MUST use these names): ${categoriesList.join(", ")}

  Return JSON ONLY: 
  { 
    "businessName": "Official Company Name", 
    "bio": "Strong professional summary (around 50 words)", 
    "suggestedCategories": ["Category Name"], // Max 5, must match names exactly from available list
    "sector": "home_services" // choose most suitable
  }`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid response");
  } catch (e) {
    console.error("AI Website Fetch Error:", e);
    return { 
      businessName: url.replace(/(https?:\/\/)?(www\.)?/, "").split('.')[0],
      bio: "Manual entry required.",
      suggestedCategories: [],
      sector: "professional"
    };
  }
}

export async function getSmartCategoriesFromText(text: string) {
  const categoriesList = await getCategoriesList();
  const prompt = `Task: Match the business description to standardized trade categories.
  
  Description: "${text}"
  
  Instructions:
  1. The description might be in Chinese, English, or mixed. Translate/Understand it first.
  2. Select up to 5 most relevant categories from the standardized list below.
  3. Respond ONLY with a JSON object in this format: { "categories": ["Category Name 1", "Category Name 2"] }
  4. If no clear matches, return an empty array for categories.
  
  Standardized Categories: ${categoriesList.join(", ")}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.categories || [];
    }
    return [];
  } catch (e) {
    console.error("AI Categorization Error:", e);
    return [];
  }
}
