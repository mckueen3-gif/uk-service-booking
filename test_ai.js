const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function testAICategorization() {
  const dataPath = path.join(process.cwd(), "src/data/checkatrade_categories.json");
  const content = fs.readFileSync(dataPath, "utf8");
  const json = JSON.parse(content);
  const categoriesList = Object.values(json).flat();

  const text = "冷氣安裝公司，水管維修，電線維修";
  const prompt = `Task: Match the business description to standardized trade categories.
  
  Description: "${text}"
  
  Instructions:
  1. The description might be in Chinese, English, or mixed. Translate/Understand it first.
  2. Select up to 5 most relevant categories from the standardized list below.
  3. Respond ONLY with a JSON object in this format: { "categories": ["Category Name 1", "Category Name 2"] }
  4. If no clear matches, return an empty array for categories.
  
  Standardized Categories: ${categoriesList.join(", ")}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log('AI RAW RESPONSE:', result.response.text());
  } catch (e) {
    console.error(e);
  }
}

testAICategorization();
