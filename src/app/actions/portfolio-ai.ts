"use server";
 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateAIContent } from "@/lib/ai-provider";

export async function generateProjectDescription(title: string, category?: string) {

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
    const systemPrompt = "You are a professional copywriting assistant for UK service providers (mechanics, plumbers, etc.).";
    const description = await generateAIContent({
      prompt,
      systemPrompt,
      jsonMode: false
    });
    
    return { success: true, description: description.trim() };
  } catch (error) {
    console.error("AI Project Description generation failed:", error);
    return { error: "Failed to generate description" };
  }
}
