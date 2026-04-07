const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testDocumentAudit() {
  console.log("🚀 Starting AI Document Auditor Test...");
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const imageUrl = "https://picsum.photos/seed/compliance/400/400";
  
  console.log(`📸 Fetching Sample Image...`);
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const prompt = `
      Professional UK Compliance Check. 
      Identify if this looks like a GAS_SAFE or business document.
      Exract info in JSON format only.
    `;

    console.log("🤖 Calling Gemini (gemini-flash-latest)...");
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ]);

    console.log("\n✅ AI Responded:", result.response.text().substring(0, 100));
  } catch (err) {
    console.error("\n❌ Test Failed:", err.message);
  }
}

testDocumentAudit();
