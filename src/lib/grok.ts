import OpenAI from "openai";

// Lazy instance holder
let _grok: OpenAI | null = null;

async function getGrokClient(): Promise<OpenAI> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI_API_KEY is missing");
  
  if (!_grok) {
    _grok = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.x.ai/v1",
    });
  }
  return _grok;
}

/**
 * Standard interface for Grok Diagnosis response matching the app's requirement
 */
export interface GrokDiagnosisOutput {
  issue: string;
  suggestedFix: string;
  estimatedPriceRange: string;
  confidence: number;
}

/**
 * Helper to get a structured diagnosis from Grok Vision
 * Note: Grok-2-vision-1212 is highly capable of image analysis
 */
export async function getGrokDiagnosis(
  base64Image: string,
  mimeType: string,
  category: string,
  description: string,
  locale: string
): Promise<GrokDiagnosisOutput | null> {
  if (!process.env.XAI_API_KEY) {
    console.warn("[Grok] API Key missing, skipping Grok diagnosis.");
    return null;
  }

  try {
    const client = await getGrokClient();
    const response = await client.chat.completions.create({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "system",
          content: `You are an expert AI Diagnostic Assistant for ConciergeAI UK. Analyze images of ${category} issues and return JSON.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image of a "${category}" issue. User description: "${description}". 
              Provide the response in ${locale} language.
              Return ONLY JSON:
              {
                "issue": "Specific problem in ${locale}",
                "suggestedFix": "Professional advice in ${locale}",
                "estimatedPriceRange": "£X - £Y",
                "confidence": 0.0-1.0
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) return null;

    return JSON.parse(content) as unknown as GrokDiagnosisOutput;
  } catch (error) {
    console.error("[Grok Vision Error]:", error);
    return null;
  }
}

/**
 * Generate an image using Grok's image generation model
 */
export async function generateGrokImage(prompt: string): Promise<string | null> {
  if (!process.env.XAI_API_KEY) return null;

  try {
    const client = await getGrokClient();
    const response = await client.images.generate({
      model: "grok-beta", 
      prompt: prompt,
    });

    return response.data[0]?.url || null;
  } catch (error) {
    console.error("[Grok Image Error]:", error);
    return null;
  }
}
