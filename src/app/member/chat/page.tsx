"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import { useSearchParams } from "next/navigation";

import { useTranslation } from "@/components/LanguageContext";

export default function ChatDashboardPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const convoId = searchParams?.get("convoId") || undefined;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{t?.merchant_messages?.title || "Messages"} <span style={{ color: 'var(--accent-color)' }}>Hub</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t?.merchant_messages?.subtitle || "Connect with your service providers in real-time."}</p>
      </div>
      
      <ChatInterface initialConversationId={convoId} />
    </div>
  );
}
