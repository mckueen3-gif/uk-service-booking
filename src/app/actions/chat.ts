"use server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';
import { generateAIContent } from '@/lib/ai-provider';
import { 
  Calendar, Clock, Save, 
  Settings, Loader2, CheckCircle2, 
  AlertCircle, Moon, Sun, 
  Coffee, Users, Info
} from 'lucide-react';

import { getEliteMerchantContext, getUserTimelineContext } from '@/lib/ai/context-provider';
import { buildConciergeSystemPrompt } from '@/lib/ai/personas';

export async function processChatMessage(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  city?: string,
  category?: string
) {
  // Move server-only imports inside the action to prevent client-side bundling issues
  const { prisma } = await import('@/lib/prisma');
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");

  const session = (await getServerSession(authOptions)) as any;
  
  // 1. Gather User Context (Assets from Garage/Properties)
  let assetContext = "";
  if (session?.user?.id) {
    const [vehicles, properties] = await Promise.all([
      (prisma as any).vehicle.findMany({ where: { userId: session.user.id } }),
      (prisma as any).property.findMany({ where: { userId: session.user.id } })
    ]);
    
    if (vehicles.length > 0) {
      assetContext += `User's Garage: ${vehicles.map((v: any) => `${v.make} ${v.model} (${v.year})`).join('; ')}. `;
    }
    if (properties.length > 0) {
      assetContext += `User's Properties: ${properties.map((p: any) => `${p.address} (${p.type})`).join('; ')}. `;
    }
  }

  // 2. Fetch Modular AI Contexts (Fail-safe)
  const [timelineContext, merchantContext] = await Promise.all([
    getUserTimelineContext(),
    getEliteMerchantContext({ city, category })
  ]);

  const dynamicContext = `
    ASSET_CONTEXT: ${assetContext || 'No specific assets listed.'}
    
    ${timelineContext}
    
    ${merchantContext}
  `;

  // 3. Assemble Unified System Prompt
  const systemPrompt = buildConciergeSystemPrompt(dynamicContext);

  try {
    const aiText = await generateAIContent({
      messages,
      systemPrompt: systemPrompt
    });
    
    return { success: true, message: { role: 'assistant', content: aiText } };
  } catch (error) {
    console.error("AI Chat process failed:", error);
    return { 
      success: false, 
      error: "Our Elite AI Concierge is momentarily indisposed. Please try again or visit our Help Center."
    };
  }
}

/**
 * 🛠️ REAL-TIME CHAT ACTIONS (User-to-Merchant)
 */

export async function getConversations() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const conversations = await (prisma as any).conversation.findMany({
    where: {
      OR: [
        { customerId: session.user.id },
        { merchant: { userId: session.user.id } }
      ]
    },
    include: {
      customer: { select: { id: true, name: true, image: true } },
      merchant: { 
        include: { 
          user: { select: { id: true, name: true, image: true } } 
        } 
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { lastMessageAt: 'desc' }
  });

  return { conversations };
}

export async function getMessages(conversationId: string) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  const messages = await (prisma as any).message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 50
  });

  // Mark messages as read if recipient
  await (prisma as any).message.updateMany({
    where: { 
      conversationId, 
      senderId: { not: session.user.id },
      isRead: false 
    },
    data: { isRead: true }
  });

  return { messages };
}

export async function sendMessage(data: {
  merchantId?: string;
  customerId?: string;
  conversationId?: string;
  content: string;
  imageUrl?: string;
}) {
  const session = (await getServerSession(authOptions)) as any;
  if (!session?.user?.id) return { error: "Unauthorized" };

  let convoId = data.conversationId;

  // If no conversationId, try to find or create one
  if (!convoId && (data.merchantId || data.customerId)) {
    const customerId = data.customerId || session.user.id;
    const merchantId = data.merchantId!;

    const existing = await (prisma as any).conversation.findFirst({
      where: { customerId, merchantId }
    });

    if (existing) {
      convoId = existing.id;
    } else {
      const newConvo = await (prisma as any).conversation.create({
        data: { customerId, merchantId }
      });
      convoId = newConvo.id;
    }
  }

  if (!convoId) return { error: "Missing conversation details" };

  const message = await (prisma as any).message.create({
    data: {
      conversationId: convoId,
      senderId: session.user.id,
      content: data.content,
      imageUrl: data.imageUrl
    }
  });

  // Update last message timestamp
  await (prisma as any).conversation.update({
    where: { id: convoId },
    data: { lastMessageAt: new Date() }
  });

  // Optional: Trigger Notification for recipient
  // (In a real app, this would trigger a push or socket event)
  
  revalidatePath('/member/chat');
  return { success: true, message };
}
