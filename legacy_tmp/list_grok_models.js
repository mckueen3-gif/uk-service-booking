const { OpenAI } = require("openai");
require("dotenv").config();

async function listGrokModels() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({ 
    apiKey, 
    baseURL: "https://api.x.ai/v1" 
  });

  try {
    const list = await client.models.list();
    console.log("Available Grok Models:", JSON.stringify(list.data.map(m => m.id), null, 2));
  } catch (e) {
    console.error("Error listing models:", e.message);
  }
}

listGrokModels();
