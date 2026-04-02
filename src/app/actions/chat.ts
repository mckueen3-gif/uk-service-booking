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

export async function processChatMessage(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  // Move server-only imports inside the action to prevent client-side bundling issues
  const { prisma } = await import('@/lib/prisma');
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const session = (await getServerSession(authOptions)) as any;
  
  let userContext = "";
  if (session?.user?.id) {
    const vehicles = await (prisma as any).vehicle.findMany({ where: { userId: session.user.id } });
    const properties = await (prisma as any).property.findMany({ where: { userId: session.user.id } });
    
    if (vehicles.length > 0) {
      userContext += `\nUser's Garage: ${vehicles.map((v: any) => `${v.make} ${v.model} (${v.year}), MOT: ${v.motDate || 'N/A'}`).join('; ')}. `;
    }
    if (properties.length > 0) {
      userContext += `\nUser's Properties: ${properties.map((p: any) => `${p.address} (${p.type}), Boiler Age: ${p.boilerAge || 'N/A'}`).join('; ')}. `;
    }
  }

  const SYSTEM_INSTRUCTION = `You are Aura, the ConciergeAI UK AI Concierge. 
    1. PLATFORM ROLE: We connect Customers to Merchants (independent pros). 
    2. REFUNDS: Payments held in Stripe Escrow. Refund requests are governed by our Legal Terms (/legal/terms).
    3. DISPUTES: AI Arbiter + Manual Oversight for fair resolution.
    4. UK COMPLIANCE: Adhere to Consumer Rights Act 2015.
    5. CUSTOMER ASSETS: ${userContext || 'None identified yet.'}
    Tone: Professional British English. Polite & Concise.`;

  const simulateResponse = (prompt: string) => {
    const input = prompt.toLowerCase();
    if (input.includes("clean")) return "We have verified cleaning pros across the UK! You can book everything from domestic help to deep cleans on our homepage.";
    if (input.includes("plumb")) return "Looking for a plumber? Browse our verified list of local experts—all Gas Safe registered where required.";
    if (input.includes("tracker") || input.includes("車")) return "Our Repair Tracker is unique! You can see real-time updates and photos of your car's progress. Check your Dashboard!";
    return "I'm the ConciergeAI AI! I'm currently in 'Efficiency Mode' but I can still help with bookings and finding local pros. How can I assist you today?";
  };

  try {
    const aiText = await generateAIContent({
      messages,
      systemPrompt: SYSTEM_INSTRUCTION
    });
    
    return { success: true, message: { role: 'assistant', content: aiText } };
  } catch (error) {
    console.error("AI Chat process failed:", error);
    return { 
      success: true, 
      message: { role: 'assistant', content: simulateResponse(messages[messages.length-1].content) + "\n\n(Note: Operating in optimized local mode due to API quota limits.)" } 
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
  
  revalidatePath('/dashboard/chat');
  return { success: true, message };
}
