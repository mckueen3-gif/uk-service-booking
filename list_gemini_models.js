const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listAllGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  // We need to use the REST API directly or the discovery URL since the SDK doesn't expose it easily.
  const fetch = require("node-fetch");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Gemini Models:", JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (e) {
    console.error("Error listing Gemini models:", e.message);
  }
}

listAllGeminiModels();
