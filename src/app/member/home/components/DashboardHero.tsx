"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Zap, RotateCcw } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: "gemini" | "grok";
}

interface DashboardHeroProps {
  userName: string;
  city?: string;
}

export default function DashboardHero({ userName, city }: DashboardHeroProps) {
  const { t, format } = useTranslation();
  const [selectedModel, setSelectedModel] = useState<"gemini" | "grok">("gemini");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get greeting based on current hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.common.greetings.morning : hour < 18 ? t.common.greetings.afternoon : t.common.greetings.evening;

  const locationLabel = city && city !== "All UK" ? city : t.member_dashboard.hero.location;

  const quickPrompts = [
    t.member_dashboard.hero.prompts.travel,
    t.member_dashboard.hero.prompts.dining,
    t.member_dashboard.hero.prompts.study,
  ];

  useEffect(() => {
    // 🚀 Precision container-only scroll to avoid page jumping
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, model: selectedModel }),
      });

      const data = await res.json().catch(() => ({ error: t.member_dashboard.hero.errors.format }));

      if (!res.ok || data.error) {
        setError(data.error || t.member_dashboard.hero.errors.unknown);
        // Remove the user message on hard error so they can retry
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, model: selectedModel },
        ]);
      }
    } catch (err) {
      setError(t.member_dashboard.hero.errors.network);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, var(--surface-1) 0%, var(--bg-secondary) 100%)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        boxShadow: "var(--shadow-xl)",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "2rem 2.5rem 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.4rem",
              fontFamily: "var(--font-heading)"
            }}
          >
            {t.member_dashboard.hero.aiAssistant}
          </p>
          <h2
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.2,
            }}
          >
            {greeting}
            <span style={{ color: "var(--accent-color)" }}>, {userName}</span>
            <br />
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "-0.01em" }}>
              {format(t.member_dashboard.hero.helpTitle, { location: locationLabel })}
            </span>
          </h2>
        </div>

        {/* ── Model Toggle ─────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--surface-2)",
            borderRadius: "999px",
            padding: "0.35rem",
            border: "1px solid var(--border-color)",
          }}
        >
          {(["gemini", "grok"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.25s ease",
                background:
                  selectedModel === m ? "var(--accent-color)" : "transparent",
                color: selectedModel === m ? "white" : "var(--text-muted)",
                boxShadow:
                  selectedModel === m
                    ? "0 4px 12px rgba(212,175,55,0.35)"
                    : "none",
              }}
            >
              {m === "gemini" ? (
                <Sparkles size={13} />
              ) : (
                <Zap size={13} />
              )}
              {m === "gemini" ? "Gemini" : "Grok"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Area ───────────────────────────────────────── */}
      <div
        ref={chatContainerRef}
        style={{
          minHeight: messages.length === 0 ? "0px" : "300px",
          maxHeight: "420px",
          overflowY: "auto",
          padding: messages.length === 0 ? "0" : "1.5rem 2.5rem",
          transition: "all 0.3s ease",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "0.9rem 1.3rem",
                borderRadius:
                  msg.role === "user"
                    ? "1.2rem 1.2rem 0.3rem 1.2rem"
                    : "1.2rem 1.2rem 1.2rem 0.3rem",
                background:
                  msg.role === "user"
                    ? "var(--accent-color)"
                    : "var(--surface-2)",
                color:
                  msg.role === "user" ? "white" : "var(--text-primary)",
                fontSize: "0.95rem",
                lineHeight: 1.65,
                fontWeight: 500,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {msg.role === "assistant" && msg.model && (
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "var(--accent-color)",
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  {msg.model === "gemini" ? (
                    <Sparkles size={11} />
                  ) : (
                    <Zap size={11} />
                  )}
                  {msg.model === "gemini" ? "Gemini" : "Grok"}
                </div>
              )}
              <p style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
            <div
              style={{
                padding: "0.9rem 1.3rem",
                borderRadius: "1.2rem 1.2rem 1.2rem 0.3rem",
                background: "var(--surface-2)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              {selectedModel === "gemini" ? "Gemini" : "Grok"} {t.member_dashboard.hero.thinking}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              margin: "0.5rem 0",
              padding: "0.8rem 1.2rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "0.8rem",
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

      </div>

      {/* ── Quick Prompts (only when chat is empty) ─────────── */}
      {messages.length === 0 && (
        <div
          style={{
            padding: "1.5rem 2.5rem",
            display: "flex",
            gap: "0.7rem",
            flexWrap: "wrap",
          }}
        >
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "999px",
                border: "1px solid var(--border-color)",
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--accent-color)";
                (e.target as HTMLElement).style.color = "var(--accent-color)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--border-color)";
                (e.target as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Box ───────────────────────────────────────── */}
      <div
        style={{
          padding: "1rem 2.5rem 2rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-end",
          borderTop: messages.length > 0 ? "1px solid var(--border-color)" : "none",
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={format(t.member_dashboard.hero.placeholder, { model: selectedModel === "gemini" ? "Gemini" : "Grok" })}
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "0.9rem 1.25rem",
            borderRadius: "1rem",
            border: "1px solid var(--border-color)",
            background: "var(--surface-2)",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "var(--font-body)",
            resize: "none",
            outline: "none",
            lineHeight: 1.5,
            minHeight: "48px",
            maxHeight: "120px",
            overflowY: "auto",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent-color)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
        />

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title={t.member_dashboard.hero.clearChat}
            style={{
              padding: "0.9rem",
              borderRadius: "1rem",
              border: "1px solid var(--border-color)",
              background: "var(--surface-2)",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <RotateCcw size={18} />
          </button>
        )}

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          style={{
            padding: "0.9rem 1.4rem",
            borderRadius: "1rem",
            border: "none",
            background:
              isLoading || !input.trim()
                ? "var(--surface-2)"
                : "var(--accent-color)",
            color:
              isLoading || !input.trim() ? "var(--text-muted)" : "white",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 800,
            fontSize: "0.9rem",
            transition: "all 0.2s ease",
            boxShadow:
              !isLoading && input.trim()
                ? "0 4px 12px rgba(212,175,55,0.35)"
                : "none",
          }}
        >
          {isLoading ? (
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Send size={18} />
          )}
          {t.member_dashboard.hero.send}
        </button>
      </div>
    </div>
  );
}
