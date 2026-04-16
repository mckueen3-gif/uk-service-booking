import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const SYSTEM_PROMPT = `你是 ConciergeAI 的智能生活管家助手。你的角色是幫助在英國的用戶解決日常生活中的各種問題。

你的專長包括：
- 英國生活常識（租屋、稅務、交通、醫療、簽證等）
- 家居維修問題診斷與建議
- 法律、財務、教育相關的初步指引
- 在適當時候推薦用戶使用平台上的專業服務商

回答原則：
- 使用繁體中文回答（除非用戶使用英文提問）
- 語氣親切友善，像一個熟悉英國生活的好朋友
- 提供實用、具體的建議而非泛泛而談
- 如果問題超出你的能力範圍，誠實告知並推薦平台上的相關專家
- 回答保持簡潔，避免冗長`;

export async function POST(req: NextRequest) {
  try {
    // Auth check: only logged-in users can use AI companion
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { message, model = "gemini" } = body as {
      message: string;
      model: "gemini" | "grok";
    };

    // Sanitize input
    const sanitizedMessage = String(message).slice(0, 2000).trim();
    if (!sanitizedMessage) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    let reply = "";

    if (model === "grok") {
      // ── GROK via xAI OpenAI-compatible API ──────────────────────────────
      const xaiKey = process.env.XAI_API_KEY;
      if (!xaiKey) {
        return NextResponse.json({ error: "Grok API key not configured" }, { status: 503 });
      }

      const { OpenAI } = await import("openai");
      const client = new OpenAI({
        apiKey: xaiKey,
        baseURL: "https://api.x.ai/v1",
      });

      const completion = await client.chat.completions.create({
        model: "grok-3-mini-fast",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: sanitizedMessage },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      reply = completion.choices?.[0]?.message?.content || "很抱歉，暫時無法取得回覆，請稍後再試。";
    } else {
      // ── GEMINI ──────────────────────────────────────────────────────────
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 503 });
      }

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const geminiModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await geminiModel.generateContent(sanitizedMessage);
      reply = result?.response?.text?.() || "很抱歉，暫時無法取得回覆，請稍後再試。";
    }

    return NextResponse.json({ reply, model });
  } catch (error: any) {
    console.error("[AI Companion Error]", error?.message || error);

    // Friendly error messages without exposing internals
    const userMessage =
      error?.message?.includes("API key") || error?.message?.includes("401")
        ? "AI 服務暫時不可用，請稍後再試。"
        : error?.message?.includes("quota") || error?.message?.includes("429")
        ? "AI 請求次數已達上限，請稍後再試。"
        : "很抱歉，遇到了一點問題，請稍後再嘗試。";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
