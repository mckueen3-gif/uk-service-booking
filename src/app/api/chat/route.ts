import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai-provider';
import { getEliteMerchantContext, getUserTimelineContext } from '@/lib/ai/context-provider';
import { buildConciergeSystemPrompt } from '@/lib/ai/personas';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages, city, category } = await req.json();
    
    // 1. Gather Context (Fail-safe modularized fetching)
    const [timelineContext, merchantContext] = await Promise.all([
      getUserTimelineContext(),
      getEliteMerchantContext({ city, category })
    ]);

    const dynamicContext = `
      ${timelineContext}
      
      ${merchantContext}
    `;

    // 2. Assemble System Prompt from Modular Persona
    const systemPrompt = buildConciergeSystemPrompt(dynamicContext);

    // 3. Generate content via Unified AI Provider
    const content = await generateAIContent({
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })),
      systemPrompt,
      jsonMode: false
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
