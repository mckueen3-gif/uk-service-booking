const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Mocking the behavior of runAIArbiter since we can't easily import the TS action in a raw node script 
// without ts-node and complex setup. I'll reimplement the core logic here to test.

async function testArbiter(disputeId) {
  console.log(`\n🔍 Testing Arbiter for Dispute: ${disputeId}`);
  
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      booking: {
        include: {
          merchant: true,
          customer: true,
          service: true,
          variations: true
        }
      },
      evidence: true
    }
  });

  if (!dispute) {
    console.error("❌ Dispute not found.");
    return;
  }

  console.log(`Found Dispute. Reason: ${dispute.reason}`);
  console.log(`Evidence count: ${dispute.evidence.length}`);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const prompt = `
    You are a professional UK service dispute arbiter.
    
    CASE DETAILS:
    - Service: ${dispute.booking.service.name}
    - Dispute Reason: ${dispute.reason}
    - Original Price: £${dispute.booking.totalAmount}
    - Disputed Variation Amount: £${dispute.booking.variations?.[0]?.amount || 0}
    
    EVIDENCE:
    ${dispute.evidence.map((e, i) => `Evidence ${i+1}: ${e.description} (URL: ${e.fileUrl})`).join('\n')}
    
    STRICT JSON OUTPUT REQUIREMENT:
    Return only a JSON object with:
    {
      "decision": "REFUND_CUSTOMER" | "FORCE_PAYOUT" | "SPLIT_COST",
      "reasoning": "Detailed explanation for both parties in Traditional Chinese (正體中文)"
    }
  `;

  console.log("🤖 Calling Gemini AI...");
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const finalResult = JSON.parse(jsonStr);
    console.log("✅ AI Decision Received:", finalResult.decision);
    console.log("📝 Reasoning Preview:", finalResult.reasoning.slice(0, 100) + "...");

    // Update DB
    await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        aiDecision: finalResult.decision,
        aiReasoning: finalResult.reasoning,
        status: 'RESOLVED'
      }
    });
    console.log("💾 Database Updated Successfully.");

  } catch (err) {
    console.error("❌ Failed to parse AI response:", text);
  }
}

// Pass the ID from simulation output
const targetId = "dis_sim_1774736596608";
testArbiter(targetId).then(() => prisma.$disconnect());
