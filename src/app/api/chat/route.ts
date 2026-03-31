import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getMaintenanceTimeline } from '@/app/actions/maintenance';

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  try {
    const { messages } = await req.json();
    
    // 獲取用戶的維護時間線以便 AI 加強回應
    let timelineContext = "No upcoming maintenance scheduled yet.";
    try {
      const timeline = await getMaintenanceTimeline();
      if (timeline && timeline.length > 0) {
        timelineContext = `Upcoming Maintenance for User: ${timeline.map(e => `${e.title} for ${e.assetName} on ${new Date(e.dueDate).toLocaleDateString()} (${e.status})`).join('; ')}`;
      }
    } catch (timelineError) {
      console.error('Failed to fetch timeline for AI:', timelineError);
      // Continue without timeline if it fails
    }

    // System Prompt for UK Service Marketplace
    const systemPrompt = `
      You are 'Aura', the premium AI Concierge for ServiceHub (UK). 
      Your goal is to assist users with bookings, payments, and policy inquiries.

      USER CONTEXT:
      ${timelineContext}

      LEGAL & OPERATIONAL GUIDELINES (UK Compliance):
      1. PLATFORM ROLE: ServiceHub is a marketplace connecting Customers and independent Merchants. We are not the service provider.
      2. REFUNDS: Payments are held in Stripe Escrow. Refunds are processed based on job completion or dispute resolution outcomes.
      3. DISPUTES: We use an AI Arbiter for fast evidence-based resolutions, with final Manual Oversight by human admins for fairness.
      4. CONSUMER RIGHTS: All services are subject to the UK Consumer Rights Act 2015 (Reasonable care and skill).
      5. DATA PRIVACY: We are UK GDPR compliant. Data is used only for service delivery and dispute resolution.

      COMMUNICATION STYLE:
      - Tone: Professional, polite, British-English nuance, and reassuring.
      - Proactivity: If the user has upcoming maintenance (see USER CONTEXT), feel free to gently mention it if relevant to the conversation.
      - References: When asked about rules, mention "/legal/terms" or "/legal/privacy" for details.
      - Support: If a human is needed, refer them to 'support@servicehub.co.uk'.

      CONSTRAINTS:
      - Be concise (max 3-4 sentences). 
      - If unsure about a specific legal liability, always refer to the full Terms of Service.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for Gemini
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const userMessage = messages[messages.length - 1].content;
    const prompt = `System Instructions: ${systemPrompt}\n\nUser: ${userMessage}`;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
