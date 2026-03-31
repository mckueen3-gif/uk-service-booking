import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendPlatformEmail, getDisputeResolvedTemplate } from '@/lib/email';

// This endpoint represents the revolutionary AI Arbiter logic
export async function POST(req: Request, { params }: { params: Promise<{ disputeId: string }> }) {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  try {
    const { disputeId } = await params;
    const body = await req.json();
    
    // In production we would fetch the Dispute, Bookings, Chat Logs, and Photos from Prisma
    // For this demonstration, we are simulating the gathered evidence context from the UI request.
    const { merchantClaim, customerClaim, originalPrice, variationAmount, hasPhotoEvidence } = body;

    const systemPrompt = `
      You are an impartial, highly analytical SaaS Dispute Mediator AI for a UK Service Platform.
      Your job is to resolve Escrow disputes between Service Merchants (Providers) and Customers.
      
      You must evaluate:
      1. Original Base Price: £${originalPrice}
      2. Additional Variation Requested: £${variationAmount}
      3. Merchant's Reasoning: "${merchantClaim}" 
      4. Customer's Rejection Justification: "${customerClaim}"
      5. Photo Evidence Provided: ${hasPhotoEvidence ? 'Yes' : 'No'}
      
      You must respond ONLY with a valid JSON object matching this schema:
      {
        "decision": "REFUND_CUSTOMER" | "FORCE_PAYOUT" | "SPLIT_COST" | "ESCALATE_TO_HUMAN",
        "reasoning": "A highly professional, objective 2-3 sentence explanation of your ruling.",
        "confidence": number between 0 and 1
      }
      
      RULES:
      - If Merchant demands > 200% of base price without extraordinary reason, lean REFUND_CUSTOMER.
      - If Customer rejects logically justified physical damage (like broken hidden pipes) that has photo proof, lean FORCE_PAYOUT (pay the merchant for call-out or parts).
      - Do NOT use markdown code blocks like \`\`\`json. Just output the raw JSON string.
    `;

    // Invoke Gemini 1.5 Pro (The Arbiter)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const textOutput = response.text() || "{}";
    
    // Clean potential markdown blocks
    const cleanedJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const verdict = JSON.parse(cleanedJson);

    // Update the database with the AI's ruling
    // await prisma.dispute.update({
    //   where: { id: disputeId },
    //   data: {
    //     aiDecision: verdict.decision,
    //     aiReasoning: verdict.reasoning,
    //     status: 'RESOLVED'
    //   }
    // });

    // 🚀 Send Real HTML Email Notification via Resend (Phase 8 Production Feature)
    await sendPlatformEmail({
      to: 'customer-or-merchant@uk-services.com', // Fetch dynamically from DB in real env
      subject: `📜 終局裁決出爐：案件 #${disputeId.toUpperCase()} 仲裁結果`,
      html: getDisputeResolvedTemplate({ disputeId, decision: verdict.decision, amount: variationAmount })
    });

    // Note: Here is where the programmatic Stripe API commands would execute:
    // if (verdict.decision === 'REFUND_CUSTOMER') { stripe.refunds.create({ payment_intent: ... }) }
    // if (verdict.decision === 'FORCE_PAYOUT') { stripe.transfers.create({ amount: ... }) }

    return NextResponse.json({ success: true, verdict });
    
  } catch (error: any) {
    console.error("AI Arbiter Error:", error);
    return NextResponse.json({ success: false, error: "AI Arbiter encountered an internal error: " + error.message }, { status: 500 });
  }
}
