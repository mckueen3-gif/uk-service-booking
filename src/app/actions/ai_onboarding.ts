"use server";

import { generateAIContent } from "@/lib/ai-provider";
import fs from "fs";
import path from "path";

async function getCategoriesList(sector?: string) {
  try {
    let fileName = "checkatrade_categories.json"; // default for technical
    if (sector === 'professional') fileName = "professional_categories.json";
    if (sector === 'education') fileName = "education_categories.json";

    const dataPath = path.join(process.cwd(), "src/data", fileName);
    const content = fs.readFileSync(dataPath, "utf8");
    const json = JSON.parse(content);
    return Object.values(json).flat() as string[];
  } catch (e) {
    return ["General Service"];
  }
}

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

    return { title, description, rawHtml: html.substring(0, 5000) };
  } catch (error) {
    return null;
  }
}

export async function fetchBusinessInfoWithAI(url: string, sector?: string) {
  if (!url) return { error: "Please provide a valid URL." };

  const metadata = await getUrlMetadata(url);
  const categoriesList = await getCategoriesList(sector);
  
  const context = metadata 
    ? `Title: ${metadata.title}\nDescription: ${metadata.description}\nContent Sample: ${metadata.rawHtml}`
    : `URL: ${url}`;

  const prompt = `Task: Analyze this business website data and write a highly compelling professional bio.
  Context: ${context}
  Target Sector: ${sector || 'unspecified'}
  
  Available Standard Categories (MUST use these names): ${categoriesList.slice(0, 200).join(", ")}

  Instructions for BIO:
  1. Style: Premium, Trustworthy, and Persuasive.
  2. Length: Approx 50-70 words.
  3. Content: Highlight their expertise, service areas, and commitment to quality.
  4. Language: If the input is Chinese/Mixed, please write the BIO in the same language style preferred by the user (or English as default if unsure).

  Return JSON ONLY: 
  { 
    "businessName": "Official Company Name", 
    "bio": "A compelling, high-conversion professional bio...", 
    "suggestedCategories": ["Category Name"], // Max 5, must match names exactly from available list
    "sector": "${sector || 'home_services'}" 
  }`;

  try {
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });
    return JSON.parse(responseText);
  } catch (e) {
    console.error("AI Website Fetch Error:", e);
    return { 
      businessName: url.replace(/(https?:\/\/)?(www\.)?/, "").split('.')[0],
      bio: "Manual entry required.",
      suggestedCategories: [],
      sector: sector || "professional"
    };
  }
}

export async function getSmartCategoriesFromText(text: string, sector?: string) {
  const categoriesList = await getCategoriesList(sector);
  const prompt = `Task: Match the business description to standardized trade categories.
  
  Description: "${text}"
  Target Sector: ${sector || 'unspecified'}
  
  Instructions:
  1. The description might be in Chinese, English, or mixed. Translate/Understand it first.
  2. Select up to 5 most relevant categories from the standardized list below.
  3. Respond ONLY with a JSON object in this format: { "categories": ["Category Name 1", "Category Name 2"] }
  4. If no clear matches, return an empty array for categories.
  
  Standardized Categories: ${categoriesList.slice(0, 200).join(", ")}`;

  try {
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });
    const parsed = JSON.parse(responseText);
    return parsed.categories || [];
  } catch (e) {
    console.error("AI Categorization Error:", e);
    return [];
  }
}


export async function generateSmartBio(businessName: string, categories: string[], sector?: string) {
  const prompt = `Task: Write a premium, high-conversion professional bio for a UK-based business.
  
  Business Name: ${businessName}
  Specialities: ${categories.join(", ")}
  Sector: ${sector || 'Professional Services'}
  
  Instructions:
  1. Language: Both Traditional Chinese and professional English (Bilingual).
  2. Tone: Elite, Reliable, Expert.
  3. Format: ONE paragraph, approx 60 words.
  4. Focus: Mention their specific categories and why users should trust them. 
  
  Return the BIO text directly (NOT JSON).`;

  try {
    return await generateAIContent({ prompt });
  } catch (e) {
    return "Expert provider in " + (sector || "professional services") + ".";
  }
}

/**
 * Real AI Document Verification using Vision
 */
export async function verifyCredentialsWithAI(fileDataUrl: string, sector: string, categories: string[]) {
  // Extract base64 and mime mapping if possible
  const mimeType = fileDataUrl.split(';')[0].split(':')[1] || "image/jpeg";
  const base64Image = fileDataUrl.split(',')[1];

  const prompt = `
    You are an expert UK Professional Compliance Auditor. 
    Analyze this uploaded document for a merchant joining in the "${sector}" sector (Categories: ${categories.join(", ")}).

    Task:
    1. Determine if this is a genuine professional certificate/license.
    2. Check if it is a specific UK mandate:
       - Gas Safe Register (Plumbing/Heating)
       - NICEIC/NAPIT (Electrical)
       - ACCA/ICAEW (Accounting)
       - SRA/Law Society (Legal)
       - SIA (Security)
    3. Verify the issuing body name and country (must be UK/Global).
    4. Estimate the expiry date if visible.
    
    UK Regulatory Requirement Check:
    - If sector is "technical", look for Gas Safe or NICEIC badges/watermarks.
    - If sector is "professional", look for regulatory membership headers.

    Instructions:
    - If it's a placeholder, sample, or generic photo (e.g. cat, building exterior), return "rejected".
    - If it's a valid certificate with high confidence, return "verified".
    - If it's a blurry but likely valid document, return "manual_review".

    Return JSON ONLY:
    {
      "status": "verified" | "manual_review" | "rejected",
      "reason": "Clear explanation in Traditional Chinese & English",
      "regulatoryBody": "Name of UK body recognized",
      "confidence": 0-1
    }
  `;

  try {
    const responseText = await generateAIContent({
      prompt,
      image: { base64: base64Image, mimeType: mimeType.startsWith('image/') ? mimeType : 'image/jpeg' }, // Handle placeholder if PDF
      jsonMode: true
    });
    return JSON.parse(responseText.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("AI Vision Review Error:", e);
    return { 
      status: "manual_review", 
      reason: "AI 視覺系統暫時無法分析，將由人工審核 (AI vision timeout, falling back to manual review)", 
      regulatoryBody: "Unknown" 
    };
  }
}

