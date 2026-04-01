const { OpenAI } = require("openai");
require("dotenv").config();

async function listAllModels() {
  const apiKey = process.env.XAI_API_KEY;
  const client = new OpenAI({ 
    apiKey, 
    baseURL: "https://api.x.ai/v1" 
  });

  try {
    const list = await client.models.list();
    console.log("Full Grok Model List:", JSON.stringify(list.data.map(m => m.id), null, 2));
  } catch (e) {
    console.error("Error listing models:", e.message);
  }
}

listAllModels();
