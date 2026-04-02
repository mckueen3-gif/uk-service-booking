// Lazy instance holders
let _genAI: any = null;
let _xai: any = null;
let _openai: any = null;

async function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  
  if (!_genAI) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

async function getXAIClient() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is missing");

  if (!_xai) {
    const { default: OpenAI } = await import("openai");
    _xai = new OpenAI({ 
      apiKey: apiKey, 
      baseURL: "https://api.x.ai/v1" 
    });
  }
  return _xai;
}

async function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  if (!_openai) {
    const { default: OpenAI } = await import("openai");
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
export async function generateAIContent(req: AIRequest & { onPrimaryError?: (err: any) => void }): Promise<string> {
  const messages: AIMessage[] = req.messages ? [...req.messages] : [];
  
  if (req.prompt) {
    messages.push({ role: 'user', content: req.prompt });
  }

  // 0. Try Grok 4.20 Reasoning (Next-Gen Primary) - Best for Logic & Diagnostics
  if (process.env.XAI_API_KEY) {
    try {
      console.info("[AI Provider] Attempting Tier 0 (xAI Grok 4.20 Reasoning)...");
      const url = "https://api.x.ai/v1/responses";
      
      const combinedPrompt = req.systemPrompt 
        ? `${req.systemPrompt}\n\nUSER REQUEST: ${messages.map(m => m.content).join("\n")}`
        : messages.map(m => m.content).join("\n");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "grok-4.20-reasoning",
          input: combinedPrompt
        })
      });

      if (res.ok) {
        const result = await res.json();
        const content = result.output?.[0]?.content?.[0]?.text || result.text;
        if (content) return content;
      } else {
        const errText = await res.text();
        console.warn("[AI Provider] Grok 4.20 API returned error:", res.status, errText);
      }
    } catch (error: any) {
      console.error("[AI Provider] Grok 4.20 Reasoning failed, falling back...", error);
    }
  }

  // 1. Try Grok 3 (Secondary - Standard Chat)
  if (process.env.XAI_API_KEY) {
    try {
      console.info("[AI Provider] Attempting Primary (xAI Grok 3)...");
      const grokMessages: any[] = [];
      if (req.systemPrompt) {
        grokMessages.push({ role: "system", content: req.systemPrompt });
      }

      for (const m of messages) {
        // Grok-3 on this account doesn't support vision, so we strip images but keep the text
        grokMessages.push({ role: m.role, content: m.content });
      }

      const client = await getXAIClient();
      const response = await client.chat.completions.create({
        model: "grok-3",
        messages: grokMessages,
        response_format: req.jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (content) return content;
    } catch (error: any) {
      console.error("[AI Provider] Grok failed, moving to next tier...", error);
      if (req.onPrimaryError) req.onPrimaryError(error);
    }
  }

  // 2. Try OpenAI GPT-4o-mini (Vision Tier)
  if (process.env.OPENAI_API_KEY && req.image) {
    try {
      console.info("[AI Provider] Attempting OpenAI Vision (GPT-4o-mini)...");
      const openaiMessages: any[] = [];
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
          openaiMessages.push({ role: m.role, content: m.content });
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
    } catch (error: any) {
      console.error("[AI Provider] OpenAI Vision failed...", error);
    }
  }

  // 2. Fallback to Gemini (Secondary)
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("No AI API Keys configured (XAI_API_KEY and GEMINI_API_KEY are missing)");
  }

  console.info("[AI Provider] Attempting Fallback (Google Gemini 2.0 Flash)...");
  const geminiClient = await getGeminiClient();
  const model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash" });

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
