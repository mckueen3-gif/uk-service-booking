const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('AVAILABLE MODELS:', JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (e) {
    console.error('List models failed:', e);
  }
}

listModels();
