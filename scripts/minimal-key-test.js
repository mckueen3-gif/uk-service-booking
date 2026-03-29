const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testKey() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, respond with 'KEY_WORKS'");
    console.log("Result:", result.response.text());
  } catch (err) {
    console.error("Test FAILED:", err.message);
  }
}

testKey();
