'use server';

import { generateAIContent } from "@/lib/ai-provider";
import { SERVICE_CATALOG } from "@/lib/constants/service-catalog";

/**
 * AI-Assisted Skill Mapping Engine
 * 
 * Maps a professional description (Natural Language) to specific Service IDs 
 * from the global service catalog.
 */
export async function mapExpertSkills(description: string) {
  if (!description || description.trim().length < 10) {
    return { success: false, error: "Description too short" };
  }

  // Pre-process catalog to limit token usage
  const simplifiedCatalog = SERVICE_CATALOG.map(s => ({ 
    id: s.id, 
    trade: s.trade, 
    keywords: s.keywords 
  }));

  const systemPrompt = `
    You are the Skill Intelligence Engine for ConciergeAI, a UK premium specialist network.
    Your objective: Map the User's Expert Description into a list of specific "id"s from our SERVICE_CATALOG.

    SERVICE_CATALOG:
    ${JSON.stringify(simplifiedCatalog, null, 2)}

    CRITICAL RULES:
    1. EXCLUSIVITY: Only return IDs that exist in the provided SERVICE_CATALOG.
    2. CONFIDENCE: Only select an ID if the evidence in the description is >80%.
    3. INFERENCE: If the user mentions tools like "multimeter", "EICR", "consumer unit", map to "elec_..." IDs. If they mention "Boiler Safe", "Gas Safe", map to "gas_..." IDs.
    4. MULTI-SERVICE: Users often provide multiple services. Select ALL that apply.
    5. FORMAT: Return ONLY a raw JSON object: {"matchedIds": ["id1", "id2", ...]}.
    6. NO HALLUCINATION: If no matches find, return an empty array for matchedIds.
  `;

  try {
    const result = await generateAIContent({
      prompt: `IDENTIFY MATCHING SERVICE IDS FOR THIS DESCRIPTION:\n\n"${description}"`,
      systemPrompt,
      jsonMode: true,
    });

    // Clean up response if it has markdown wrappers
    let cleanText = result.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7, cleanText.length - 3);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3, cleanText.length - 3);
    }

    const parsed = JSON.parse(cleanText);
    
    // Validate that returned IDs actually exist in our catalog
    const validIds = (parsed.matchedIds || []).filter((id: string) => 
      SERVICE_CATALOG.some(sc => sc.id === id)
    );

    return { 
      success: true, 
      matchedIds: validIds 
    };
  } catch (error) {
    console.error("[Skill Mapping Error]:", error);
    return { success: false, error: "AI Mapping failed. Please try manual selection." };
  }
}
