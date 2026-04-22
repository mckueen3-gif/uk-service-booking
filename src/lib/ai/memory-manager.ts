"use server";

import { prisma } from '@/lib/prisma';
import { generateAIContent } from '@/lib/ai-provider';

/**
 * Extracts and updates user-specific preferences based on the latest interaction.
 */
export async function updateAIChatMemory(userId: string, latestMessage: string, currentMemory: string = "") {
  try {
    const extractionPrompt = `
      You are a specialized 'Memory Extractor'. 
      Your task is to identify new user preferences, assets, or permanent facts from the latest message.
      
      LATEST MESSAGE: "${latestMessage}"
      CURRENT MEMORY: "${currentMemory}"
      
      Instructions:
      1. ONLY extract meaningful, permanent facts (e.g., "likes weekends", "owns a cat", "looking for a lawyer").
      2. IGNORE temporary questions or casual greetings.
      3. Format as a concise, bulleted list of current known facts.
      4. Keep the total memory under 500 characters.
      5. Response should ONLY be the updated memory string.
    `;

    const updatedMemory = await generateAIContent({
      messages: [{ role: 'user', content: 'Extract facts.' }],
      systemPrompt: extractionPrompt
    });

    if (updatedMemory && updatedMemory.length > 5) {
      await (prisma as any).user.update({
        where: { id: userId },
        data: { aiMemory: updatedMemory }
      });
      return true;
    }
  } catch (error) {
    console.error("Failed to update AI Memory:", error);
  }
  return false;
}
