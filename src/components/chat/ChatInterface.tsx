"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, Image as ImageIcon, Search, 
  User as UserIcon, MessageSquare, 
  Loader2, Check, CheckCheck, 
  ChevronLeft, MoreVertical, Phone,
  Paperclip
} from 'lucide-react';
import { getMessages, sendMessage, getConversations } from "@/app/actions/chat";
import { useSearchParams } from "next/navigation";

interface ChatProps {
  initialConversationId?: string;
}

export default function ChatInterface({ initialConversationId }: ChatProps) {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(initialConversationId || null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Polling for new messages
  useEffect(() => {
    async function init() {
      await loadConversations();
      
      // If we have a merchantId but no convo, try to get/start it
      const mid = searchParams?.get("merchantId");
      if (mid && !currentConvoId) {
         const res = await sendMessage({ merchantId: mid, content: "你好，我有服務預約細節想諮詢 (Hi, I have an inquiry about a booking)." });
         if (res.success && res.message) {
            setCurrentConvoId((res.message as any).conversationId);
            await loadConversations(true);
         }
      }
    }
    init();

    const interval = setInterval(() => {
      loadConversations(true);
      if (currentConvoId) loadMessages(currentConvoId, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentConvoId]);

  async function loadConversations(silent = false) {
    if (!silent && !conversations.length) setLoading(true);
    const res = await getConversations();
    if (res.conversations) setConversations(res.conversations);
    setLoading(false);
  }

  async function loadMessages(id: string, silent = false) {
    const res = await getMessages(id);
    if (res.messages) {
      setMessages(res.messages);
      if (!silent) scrollToBottom();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConvoId) return;

    const content = inputText;
    setInputText("");

    // 🚀 OPTIMISTIC UPDATE: Add message to UI immediately
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: content,
      senderId: 'ME',
      createdAt: new Date().toISOString(),
      isRead: false,
      isPending: true // Visual indicator if needed
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();

    setSending(true);
    const res = await sendMessage({
      conversationId: currentConvoId,
      content: content
    });

    if (res.success) {
      // Replace optimistic message with real message or just refresh
      loadMessages(currentConvoId, true);
    } else {
      // Handle failure: optionally remove the optimistic message
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    }
    setSending(false);
  };

  const activeConvo = conversations.find(c => c.id === currentConvoId);

  // 🚀 NO FULL-SCREEN BLOCKING: Show the shell immediately even if data is loading
  // (We'll handle specific loading states within components)

  return (
    <div className="glass-panel" style={{ height: '700px', display: 'flex', overflow: 'hidden', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
      
      {/* Sidebar: Chat List */}
      <div style={{ width: '320px', borderRight: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>訊息 (Messages)</h2>
           <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={16} />
              <input 
                placeholder="搜尋聯絡人..." 
                className="input-field" 
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem', borderRadius: '10px' }} 
              />
           </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
           {conversations.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>尚無對話記錄</div>
           ) : (
             conversations.map(c => (
               <div 
                 key={c.id} 
                 onClick={() => setCurrentConvoId(c.id)}
                 style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', cursor: 'pointer', backgroundColor: currentConvoId === c.id ? 'var(--bg-secondary)' : 'transparent', borderLeft: `4px solid ${currentConvoId === c.id ? 'var(--accent-color)' : 'transparent'}`, transition: 'all 0.2s' }}
               >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 800 }}>
                    {c.customer?.name?.[0] || 'U'}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.customer?.name || "未知用戶"}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>12:30</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {c.messages?.[0]?.content || "尚未開始對話"}
                    </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
        {currentConvoId ? (
          <>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface-1)', borderBottom: '1.5px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{activeConvo?.customer?.name || "對話中..."}</div>
                    <div style={{ fontSize: '0.7rem', color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#facc15' }}></div> Online
                    </div>
                  </div>
               </div>
               <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                  <Phone size={18} />
                  <MoreVertical size={18} />
               </div>
            </div>

            {/* Content */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {messages.map(m => (
                 <div key={m.id} style={{ alignSelf: m.senderId === 'ME' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '16px', backgroundColor: m.senderId === 'ME' ? 'var(--accent-color)' : 'var(--surface-1)', color: m.senderId === 'ME' ? 'white' : 'var(--text-primary)', border: m.senderId === 'ME' ? 'none' : '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>
                       {m.content}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'flex', justifyContent: m.senderId === 'ME' ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '4px' }}>
                       {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       {m.senderId === 'ME' && (m.isRead ? <CheckCheck size={12} color="#facc15" /> : <Check size={12} />)}
                    </div>
                 </div>
               ))}
            </div>

            {/* Input */}
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-1)', borderTop: '1.5px solid var(--border-color)' }}>
               <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem' }}>
                    <Paperclip size={20} />
                    <ImageIcon size={20} />
                  </div>
                  <input 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="輸入訊息內容..." 
                    className="input-field" 
                    style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '12px' }} 
                  />
                  <button type="submit" disabled={sending} className="btn btn-primary" style={{ padding: '0.6rem', borderRadius: '12px' }}>
                     {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center' }}>
             <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
             <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>選擇一個對話開始交流 Select a Chat</h3>
             <p style={{ maxWidth: '300px', fontSize: '0.9rem', marginTop: '0.5rem' }}>溝通細節、上傳照片，或是詢問服務相關問題。</p>
          </div>
        )}
      </div>
    </div>
  );
}
