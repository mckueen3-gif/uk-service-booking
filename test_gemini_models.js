const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // There isn't a direct listModels on the genAI instance in the same way, 
    // but we can try to fetch it via the internal discovery if available, 
    // or just try common names.
    // Actually, in @google/generative-ai there isn't a simple listModels() helper on the main class.
    // We'll just try gemini-1.5-flash-002 or gemini-1.5-pro-002 as these are newer.
    console.log("Checking gemini-1.5-flash-latest...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("test");
    console.log("gemini-1.5-flash-latest is AVAILABLE");
  } catch (e) {
    console.error("gemini-1.5-flash-latest FAILED:", e.message);
  }
}

listGeminiModels();
