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

  const prompt = `Analyze this business from its website/info.
  Context: ${context}
  
  Available standard categories: ${categoriesList.join(", ")}

  Return JSON ONLY: 
  { 
    "businessName": "...", 
    "bio": "...", 
    "suggestedCategories": ["Category1", "Category2"], // Must match from Available list above
    "sector": "automotive|home_services|professional|beauty|education|health" 
  }`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid response");
  } catch (e) {
    // Fallback logic
    return { 
      businessName: url.split('.')[0].replace(/[^a-zA-Z]/g, ' '),
      bio: "Professional services provider.",
      suggestedCategories: ["Handyman"],
      sector: "professional"
    };
  }
}

export async function getSmartCategoriesFromText(text: string) {
  const categoriesList = await getCategoriesList();
  const prompt = `Analyze this business description: "${text}"
  Select the most relevant trade categories from this list: ${categoriesList.join(", ")}
  Return JSON: { "categories": ["Category1", "Category2"] }`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]).categories;
    return [];
  } catch (e) {
    return [];
  }
}
