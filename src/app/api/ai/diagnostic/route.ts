import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateAIContent } from "@/lib/ai-provider";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subject, level, tutorName } = await req.json();

    if (!subject || !level) {
      return NextResponse.json({ error: "Missing subject or level" }, { status: 400 });
    }

    console.info(`[AI Diagnostic] Generating questions for ${subject} (${level}) by ${tutorName}...`);

    const systemPrompt = `You are an elite UK private tutor. 
    Your goal is to generate a high-quality diagnostic challenge for a student interested in [${subject}] at [${level}] level with tutor [${tutorName}].
    
    CRITICAL: Return ONLY a JSON array of exactly 5 question objects. 
    Each object must have:
    - 'question': string (The diagnostic question)
    - 'options': string[] (Exactly 4 choices)
    - 'correctIndex': number (0-3 representing the correct option)
    - 'explanation': string (A short, encouraging explanation for the correct answer)

    Tone: Professional, expert, and encouraging.
    Format: Pure JSON array. No markdown, no introductory text.`;

    const prompt = `Generate 5 diagnostic questions for ${subject} at ${level} level.`;

    const response = await generateAIContent({
      prompt,
      systemPrompt,
      jsonMode: true
    });

    let questions;
    try {
      questions = JSON.parse(response);
      // If it's wrapped in an object like { questions: [...] }
      if (!Array.isArray(questions) && questions.questions) {
        questions = questions.questions;
      }
    } catch (e) {
      console.error("[AI Diagnostic] Failed to parse AI response:", response);
      throw new Error("Invalid AI response format");
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("AI Diagnostic API Error:", error);
    return NextResponse.json({ 
      error: "AI is currently busy preparing your academic challenge. Please try again in a moment.",
      details: error.message 
    }, { status: 500 });
  }
}
