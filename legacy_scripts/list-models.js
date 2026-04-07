const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    // Note: listModels is not on the same object in all SDK versions
    // Usually it's available via a separate client or by trying common names
    console.log("Listing models (this might fail if the SDK version doesn't support it directly)...");
    
    // Instead of listing, let's try the most definitive name
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-8b", "gemini-pro-vision"];
    
    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        // Try a tiny request to see if it exists
        await model.generateContent("test");
        console.log(`Model FOUND and WORKING: ${name}`);
      } catch (err) {
        console.log(`Model FAILED: ${name} - ${err.message}`);
      }
    }

  } catch (err) {
    console.error("List Models Error:", err.message);
  } finally {
    process.exit();
  }
}

listModels();
