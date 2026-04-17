import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai-provider';
import { getEliteMerchantContext, getUserTimelineContext } from '@/lib/ai/context-provider';
import { buildConciergeSystemPrompt } from '@/lib/ai/personas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateAIChatMemory } from '@/lib/ai/memory-manager';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { messages, city, category, locale = 'en' } = await req.json();
    
    // 1. Fetch User Memory if logged in
    let userMemory = "";
    if (session?.user?.id) {
       const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { aiMemory: true }
       });
       userMemory = user?.aiMemory || "";
    }

    // 2. Gather Context (Fail-safe modularized fetching)
    const [timelineContext, merchantContext] = await Promise.all([
      getUserTimelineContext(),
      getEliteMerchantContext({ city, category })
    ]);

    const dynamicContext = `
      ${timelineContext}
      
      ${merchantContext}
    `;

    // 3. Assemble System Prompt from Modular Persona (Pass userMemory)
    const systemPrompt = buildConciergeSystemPrompt(dynamicContext, locale, userMemory);

    // 4. Generate content via Unified AI Provider
    const content = await generateAIContent({
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content
      })),
      systemPrompt,
      jsonMode: false
    });

    // 5. Background Task: Memory Extraction (Non-blocking)
    if (session?.user?.id && messages.length > 0) {
       const latestMsg = messages[messages.length - 1].content;
       updateAIChatMemory(session.user.id, latestMsg, userMemory).catch(err => {
          console.error("[Chat Memory] Background update failed:", err);
       });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
