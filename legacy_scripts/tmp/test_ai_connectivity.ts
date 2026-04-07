import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

async function testConnectivity() {
  console.log("--- Testing xAI (Standard API) ---");
  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    console.log("XAI_API_KEY is missing");
  } else {
    try {
      const client = new OpenAI({ 
        apiKey: xaiKey, 
        baseURL: "https://api.x.ai/v1" 
      });
      const response = await client.chat.completions.create({
        model: "grok-2-1212",
        messages: [{ role: "user", content: "Say 'xAI Success'" }],
      });
      console.log("xAI Status: SUCCESS", response.choices[0].message.content);
    } catch (e: any) {
      console.log("xAI Status: FAILED", e.message);
    }
  }

  console.log("\n--- Testing xAI (/v1/responses - Legacy/Fake?) ---");
  if (xaiKey) {
    try {
      const res = await fetch("https://api.x.ai/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${xaiKey}` },
        body: JSON.stringify({ model: "grok-4.20-reasoning", input: "Say 'Fake Success'" })
      });
      console.log("xAI Legacy Status:", res.status, await res.text());
    } catch (e: any) {
      console.log("xAI Legacy Status: FAILED", e.message);
    }
  }

  console.log("\n--- Testing Gemini ---");
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.log("GEMINI_API_KEY is missing");
  } else {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent("Say 'Gemini Success'");
      console.log("Gemini Status: SUCCESS", result.response.text());
    } catch (e: any) {
      console.log("Gemini Status: FAILED", e.message);
    }
  }
}

testConnectivity();
