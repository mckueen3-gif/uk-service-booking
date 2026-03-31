import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const XAI_API_KEY = process.env.XAI_API_KEY || "";

// Lazy instance holders
let _genAI: GoogleGenerativeAI | null = null;
let _xai: OpenAI | null = null;

function getGeminiClient() {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
  if (!_genAI) _genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return _genAI;
}

function getXAIClient() {
  if (!XAI_API_KEY) throw new Error("XAI_API_KEY is missing");
  if (!_xai) _xai = new OpenAI({ 
    apiKey: XAI_API_KEY, 
    baseURL: "https://api.x.ai/v1" 
  });
  return _xai;
}

/**
 * Robust retry wrapper for transient 503/429 errors from LLM providers
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error.message?.includes('503') || 
                        error.message?.includes('429') || 
                        error.status === 503 || 
                        error.status === 429;
    
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
}

/**
 * Centralized AI provider that prioritizes xAI Grok and falls back to Google Gemini.
 * Coordinates between multiple models and handles reliability (retries).
 */
export async function generateAIContent(req: AIRequest): Promise<string> {
  const messages: AIMessage[] = req.messages ? [...req.messages] : [];
  
  if (req.prompt) {
    messages.push({ role: 'user', content: req.prompt });
  }

  // 1. Try Grok (Primary)
  if (XAI_API_KEY) {
    try {
      console.info("[AI Provider] Attempting Primary (xAI Grok)...");
      const grokMessages: any[] = [];
      if (req.systemPrompt) {
        grokMessages.push({ role: "system", content: req.systemPrompt });
      }

      for (const m of messages) {
        if (m.role === 'user' && req.image && m === messages[messages.length - 1]) {
          grokMessages.push({
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
          grokMessages.push({ role: m.role, content: m.content });
        }
      }

      const response = await getXAIClient().chat.completions.create({
        model: req.image ? "grok-2-vision-1212" : "grok-2-1212",
        messages: grokMessages,
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) return content;
    } catch (error) {
      console.error("[AI Provider] Grok failed, moving to fallback...", error);
    }
  }

  // 2. Fallback to Gemini (Secondary)
  if (!GEMINI_API_KEY) {
    throw new Error("No AI API Keys configured (XAI_API_KEY and GEMINI_API_KEY are missing)");
  }

  console.info("[AI Provider] Attempting Fallback (Google Gemini 1.5 Flash)...");
  const model = getGeminiClient().getGenerativeModel({ model: "gemini-1.5-flash" });

  const contents = messages.map((m, idx) => {
    const parts: any[] = [{ text: m.content }];
    if (m.role === 'user' && req.image && idx === messages.length - 1) {
      parts.push({
        inlineData: {
          data: req.image.base64,
          mimeType: req.image.mimeType
        }
      });
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts
    };
  });

  const systemInstruction = req.systemPrompt ? { parts: [{ text: req.systemPrompt }] } : undefined;

  const result = await withRetry(async () => {
    return await model.generateContent({
      contents,
      systemInstruction: systemInstruction as any,
      generationConfig: req.jsonMode ? { responseMimeType: "application/json" } : undefined
    });
  });

  const text = result.response.text();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}
