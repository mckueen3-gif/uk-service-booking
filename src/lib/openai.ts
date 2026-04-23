import OpenAI from "openai";

let _openai: OpenAI | null = null;

async function getOpenAIClient(): Promise<OpenAI> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");
  
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return _openai;
}

/**
 * Generate an image using OpenAI's DALL-E 3 model
 */
export async function generateOpenAIImage(prompt: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const client = await getOpenAIClient();
    const response = await client.images.generate({
      model: "dall-e-3", 
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    return response.data[0]?.url || null;
  } catch (error) {
    console.error("[OpenAI Image Error]:", error);
    return null;
  }
}
