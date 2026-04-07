const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * 助手函數：抓取圖片並轉為 Base64
 */
async function fetchImageBase64(url) {
  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch (err) {
    console.warn("Failed to fetch image, using 1x1 fallback:", err.message);
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  }
}

async function testAI() {
  const variationId = 'var_demo_01';
  console.log(`🚀 Starting AI Arbiter Simulation for: ${variationId}...`);

  try {
    const variation = await prisma.variation.findUnique({
      where: { id: variationId },
      include: { 
        booking: { 
          include: { 
            service: true 
          } 
        } 
      }
    });

    if (!variation || !variation.photoUrl) {
       console.log("❌ Error: Variation or photo not found in DB.");
       return;
    }

    console.log(`📸 Fetching Evidence Photo: ${variation.photoUrl}`);
    const base64Image = await fetchImageBase64(variation.photoUrl);
    
    if (!base64Image) {
        console.log("❌ Error: Could not convert image to base64.");
        return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are an expert impartial AI Arbiter for UK Service Marketplace.
      A merchant is performing a "${variation.booking.service.name}" service.
      They proposed an additional charge of £${variation.amount} for: "${variation.description}".

      ADR POLICY (ARBITRATION RULES):
      1. LABOR COST (人工費用): If the photo shows the work involves manual labor (installation, repair, etc.) and it's confirmed done, the Labor portion should be honored (FORCE_PAYOUT).
      2. MATERIAL COST (材料費用): Check if the material price mentioned in "${variation.description}" is reasonable/fair for the UK market (e.g. B&Q, Screwfix rates).
      3. If materials are overpriced but labor is done, recommend SPLIT_COST or a partial pay.
      4. If the work was necessary due to "Aging/Broken hardware" found during service (Professional reasoning), lean FORCE_PAYOUT.

      Return a JSON response ONLY (No Markdown):
      {
        "decision": "FORCE_PAYOUT" | "REFUND_CUSTOMER" | "SPLIT_COST",
        "reasoning": "Professional explanation in Traditional Chinese and English. Explain the Labor vs Material breakdown.",
        "confidence": 0.0-1.0
      }
    `;

    console.log("🤖 Calling Gemini 1.5 Flash for Decision...");
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);

    const text = result.response.text();
    console.log("\n--- AI RAW RESPONSE ---");
    console.log(text);
    
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const decision = JSON.parse(jsonStr);
    
    console.log("\n--- PARSED DECISION ---");
    console.log(`Verdict: ${decision.decision}`);
    console.log(`Confidence: ${Math.round(decision.confidence * 100)}%`);
    console.log(`Reasoning: ${decision.reasoning}`);

  } catch (err) {
    console.error("💥 AI TEST FAILURE:", err);
  } finally {
    process.exit();
  }
}

testAI();
