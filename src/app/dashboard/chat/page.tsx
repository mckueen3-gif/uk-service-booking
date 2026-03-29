"use client";

import ChatInterface from "@/components/chat/ChatInterface";
import { useSearchParams } from "next/navigation";

export default function ChatDashboardPage() {
  const searchParams = useSearchParams();
  const convoId = searchParams?.get("convoId") || undefined;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>對話中心 <span style={{ color: 'var(--accent-color)' }}>Hub</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>與專業師傅或您的客戶進行即時溝通</p>
      </div>
      
      <ChatInterface initialConversationId={convoId} />
    </div>
  );
}
