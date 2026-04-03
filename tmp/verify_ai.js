const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function verifyAI() {
  const xaiKey = process.env.XAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  console.log("Verifying xAI (Grok-2-1212)...");
  if (xaiKey) {
    const client = new OpenAI({ apiKey: xaiKey, baseURL: "https://api.x.ai/v1" });
    try {
      const res = await client.chat.completions.create({
        model: "grok-2-1212",
        messages: [{ role: "user", content: "Say 'xAI verified'" }],
      });
      console.log("xAI Response:", res.choices[0].message.content);
    } catch (e) {
      console.error("xAI Failed:", e.message);
    }
  } else {
    console.log("XAI_API_KEY missing");
  }

  console.log("\nVerifying Gemini (Fallback)...");
  if (geminiKey) {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
      const result = await model.generateContent("Say 'Gemini verified'");
      console.log("Gemini Response:", result.response.text());
    } catch (e) {
      console.error("Gemini Failed:", e.message);
    }
  } else {
    console.log("GEMINI_API_KEY missing");
  }
}

verifyAI();
