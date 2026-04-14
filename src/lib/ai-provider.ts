import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Lazy instance holders
let _genAI: GoogleGenerativeAI | null = null;
let _xai: OpenAI | null = null;
let _openai: OpenAI | null = null;

async function getGeminiClient(): Promise<GoogleGenerativeAI> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

async function getXAIClient(): Promise<OpenAI> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is missing");

  if (!_xai) {
    _xai = new OpenAI({ 
      apiKey: apiKey, 
      baseURL: "https://api.x.ai/v1" 
    });
  }
  return _xai;
}

async function getOpenAIClient(): Promise<OpenAI> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  if (!_openai) {
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

/**
 * Robust retry wrapper for transient 503/429 errors from LLM providers
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    const errorWithStatus = error as { message?: string, status?: number };
    const isRetryable = errorWithStatus.message?.includes('503') || 
                        errorWithStatus.message?.includes('429') || 
                        errorWithStatus.status === 503 || 
                        errorWithStatus.status === 429;
    
    if (retries > 0 && isRetryable) {
      console.warn(`[AI Provider] transient error detected, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIRequest {
  prompt?: string;
  messages?: AIMessage[];
  image?: {
    base64: string;
    mimeType: string;
  };
  systemPrompt?: string;
  jsonMode?: boolean;
  strictMode?: boolean;
}

/**
 * Centralized AI provider that prioritizes xAI Grok and falls back to Google Gemini.
 * Coordinates between multiple models and handles reliability (retries).
 */
export async function generateAIContent(req: AIRequest & { onPrimaryError?: (err: Error | unknown) => void }): Promise<string> {
  const messages: AIMessage[] = req.messages ? [...req.messages] : [];
  
  if (req.prompt) {
    messages.push({ role: 'user', content: req.prompt });
  }

  // 0. High-Fidelity Vision Reasoning (Tier 0 - STRICT MODE)
  if (req.strictMode && req.image && process.env.XAI_API_KEY) {
    try {
      console.info("[AI Provider] Entering STRICT VISION MODE (Grok native vision reasoning)...");
      const client = await getXAIClient();
      
      const strictMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (req.systemPrompt) {
        strictMessages.push({ role: "system", content: `${req.systemPrompt}\n\nSTRICT INSTRUCTION: Perform a multi-step visual verification. Check for subtle indicators of damage, age, and environmental context. Do not hallucinate parts. If the image is unclear, state the uncertainty.` });
      }

      strictMessages.push({
        role: "user",
        content: [
          { type: "text", text: req.prompt || "Please perform a professional UK-standard technical diagnosis of this issue." },
          {
            type: "image_url",
            image_url: { url: `data:${req.image.mimeType};base64,${req.image.base64}` }
          }
        ]
      });

      const response = await client.chat.completions.create({
        model: "grok-2-1212",
        messages: strictMessages,
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) {
        console.info("[AI Provider] Strict Vision Mode Success.");
        return content;
      }
    } catch (error: unknown) {
      console.error("[AI Provider] Strict Vision Mode failed, falling back to chain...", error instanceof Error ? error.message : String(error));
    }
  }

  // 1. Try Vision Reasoning Chain (Gemini Vision + Grok Reasoning)
  if (process.env.GEMINI_API_KEY && process.env.XAI_API_KEY && req.image) {
    try {
      console.info("[AI Provider] Starting Unified Vision Reasoning Chain (Gemini + Grok)...");
      
      // Part A: Get Visual Description from Gemini 1.5 Flash (Fidelity King)
      console.info("[AI Provider] Step 1: Gemini 1.5 Flash stripping pixels...");
      const geminiClient = await getGeminiClient();
      const visionModel = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const visionPrompt = "Please provide a highly structured technical description of the physical issue in this photo. Use the format: PART_IDENTIFIED: [Exact name of part], DAMAGE_TYPE: [e.g., Burst, Pin-hole leak, Corrosion, Burned], CONTEXT: [e.g., Outdoor, Under-sink, In-wall]. Focus on identifying exactly what is failing to prevent diagnostic hallucinations.";
      
      const imageData = req.image; // Narrow type for closure
      const visionResult = await withRetry(async () => {
        return await visionModel.generateContent([
          { text: visionPrompt },
          { inlineData: { data: imageData.base64, mimeType: imageData.mimeType } }
        ]);
      });
      
      const visualDescription = visionResult.response.text();
      console.info("[AI Provider] Step 1 Success. Gemini Visual Description received.");

      // Part B: Feed Visual Ground Truth to Grok for Reasoning
      if (visualDescription) {
        console.info("[AI Provider] Step 2: Grok-2 diagnosing based on visual ground truth...");
        
        const combinedPrompt = `
          SYSTEM: ${req.systemPrompt || "You are an expert UK maintenance specialist."}
          
          CRITICAL INSTRUCTION: THE FOLLOWING TECHNICAL VISUAL REPORT FROM GEMINI IS THE ABSOLUTE GROUND TRUTH. 
          STRICTLY FOLLOW THE VISUAL REPORT. IGNORE YOUR DEFAULT STATISTICAL ASSUMPTIONS.
          
          TECHNICAL VISUAL REPORT: 
          "${visualDescription}"
          
          USER DESCRIPTION: 
          "${req.prompt || "No text description provided."}"
          
          TASK: Based on the visual report and user description, perform a professional diagnosis.
        `;

        const xaiClient = await getXAIClient();
        
        const response = await xaiClient.chat.completions.create({
          model: "grok-2-1212",
          messages: [
            { role: "system", content: "You are an expert UK maintenance specialist. Strictly follow the provided Gemini technical visual report." },
            { role: "user", content: combinedPrompt }
          ],
          response_format: req.jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.1,
        });

        const content = response.choices[0].message.content;
        if (content) {
          console.info("[AI Provider] Vision Reasoning Chain Success.");
          return content;
        }
      }
    } catch (error: unknown) {
      console.error("[AI Provider] Vision Reasoning Chain failed:", error instanceof Error ? error.message : String(error));
    }
  }

  // 1. Try Grok 4.20 (Standard Reasoning fallback for text only)
  if (process.env.XAI_API_KEY) {
    try {
      console.info("[AI Provider] Attempting Tier 1 (xAI Grok-2-1212)...");
      const client = await getXAIClient();
      
      const response = await client.chat.completions.create({
        model: "grok-2-1212",
        messages: [
          ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
          ...messages
        ] as OpenAI.Chat.ChatCompletionMessageParam[],
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) return content;
    } catch (error: unknown) {
      console.error("[AI Provider] Grok-2-1212 failed...", error instanceof Error ? error.message : String(error));
    }
  }

  // 2. Try Grok 3 (Standard Chat)
  if (process.env.XAI_API_KEY) {
    try {
      console.info("[AI Provider] Attempting Tier 2 (xAI Grok-beta)...");
      const grokMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (req.systemPrompt) {
        grokMessages.push({ role: "system", content: req.systemPrompt });
      }

      for (const m of messages) {
        grokMessages.push({ role: m.role as "user" | "assistant" | "system", content: m.content });
      }

      const client = await getXAIClient();
      const response = await client.chat.completions.create({
        model: "grok-beta",
        messages: grokMessages,
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) return content;
    } catch (error: unknown) {
      console.error("[AI Provider] Grok failed, moving to next tier...", error instanceof Error ? error.message : String(error));
      if (req.onPrimaryError) req.onPrimaryError(error);
    }
  }

  // 2. Try OpenAI GPT-4o-mini (Vision Tier)
  if (process.env.OPENAI_API_KEY && req.image) {
    try {
      console.info("[AI Provider] Attempting OpenAI Vision (GPT-4o-mini)...");
      const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (req.systemPrompt) {
        openaiMessages.push({ role: "system", content: req.systemPrompt });
      }

      for (const m of messages) {
        if (m.role === 'user' && req.image && m === messages[messages.length - 1]) {
          openaiMessages.push({
            role: "user",
            content: [
              { type: "text", text: m.content },
              {
                type: "image_url",
                image_url: { url: `data:${req.image.mimeType};base64,${req.image.base64}` }
              }
            ]
          });
        } else {
          openaiMessages.push({ role: m.role as "user" | "assistant" | "system", content: m.content });
        }
      }

      const client = await getOpenAIClient();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) return content;
    } catch (error: unknown) {
      console.error("[AI Provider] OpenAI Vision failed...", error instanceof Error ? error.message : String(error));
    }
  }

  // 2. Fallback to Gemini (Secondary)
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("No AI API Keys configured (XAI_API_KEY and GEMINI_API_KEY are missing)");
  }

  console.info("[AI Provider] Attempting Fallback (Google Gemini 1.5 Flash)...");
  const geminiClient = await getGeminiClient();
  const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

  const contents = messages.map((m, idx) => {
    const parts: import("@google/generative-ai").Part[] = [{ text: m.content }];
    if (m.role === 'user' && req.image && idx === messages.length - 1) {
      parts.push({
        inlineData: {
          data: req.image.base64,
          mimeType: req.image.mimeType
        }
      });
    }
    return {
      role: (m.role === 'assistant' ? 'model' : m.role === 'system' ? 'user' : 'user') as "user" | "model",
      parts
    };
  });

  const systemInstruction = req.systemPrompt ? { parts: [{ text: req.systemPrompt }] } : undefined;

  const result = await withRetry(async () => {
    return await model.generateContent({
      contents,
      systemInstruction: systemInstruction as import("@google/generative-ai").Content,
      generationConfig: req.jsonMode ? { responseMimeType: "application/json" } : undefined
    });
  });

  const text = result.response.text();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}
