const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    // Note: listModels is not directly on genAI in some versions of the SDK
    // It's usually a separate fetch or part of the internal client
    console.log("Listing models is SDK dependent. Let's try gemini-1.5-flash-8b or gemini-2.0-flash-exp if available.");
    
    // Most common working name in current SDKs
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro-vision'];
    
    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        console.log(`Checking ${name}...`);
        const result = await model.generateContent("Hello");
        console.log(`✅ ${name} works: ${result.response.text().substring(0, 20)}`);
        process.exit(0);
      } catch (e) {
        console.log(`❌ ${name} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
