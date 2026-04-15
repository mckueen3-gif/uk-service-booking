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
import { useSession } from "next-auth/react";
import { useTranslation } from "@/components/LanguageContext";

interface ChatProps {
  initialConversationId?: string;
}

export default function ChatInterface({ initialConversationId }: ChatProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(initialConversationId || null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = (session?.user as any)?.id;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large (Max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Polling for new messages
  useEffect(() => {
    async function init() {
      await loadConversations();
      
      // If we have a merchantId but no convo, try to get/start it
      const mid = searchParams?.get("merchantId");
      const cid = searchParams?.get("customerId");

      if ((mid || cid) && !currentConvoId) {
         setLoading(true);
         const res = await sendMessage({ 
           merchantId: mid || undefined, 
           customerId: cid || undefined,
           content: t?.merchant_messages?.initialPrompt || "Hi, I have an inquiry about a booking." 
         });
         if (res.success && res.message) {
            setCurrentConvoId((res.message as any).conversationId);
            await loadConversations(true);
         }
         setLoading(false);
      }
    }
    init();

    const interval = setInterval(() => {
      loadConversations(true);
      if (currentConvoId) loadMessages(currentConvoId, true);
    }, 4000); // 4 seconds polling
    return () => clearInterval(interval);
  }, [currentConvoId, searchParams, userId]);

  useEffect(() => {
    if (currentConvoId) {
      loadMessages(currentConvoId);
    }
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
      // Only update if message count changed or first load
      if (res.messages.length !== (messages || []).length || !silent) {
        setMessages(res.messages);
        if (!silent || (res.messages.length > (messages || []).length)) scrollToBottom();
      }
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
    if ((!inputText.trim() && !selectedImage) || !currentConvoId) return;

    const content = inputText;
    const imageUrl = selectedImage;
    setInputText("");
    setSelectedImage(null);

    // 🚀 OPTIMISTIC UPDATE: Add message to UI immediately
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: content,
      imageUrl: imageUrl,
      senderId: userId,
      createdAt: new Date().toISOString(),
      isRead: false,
      isPending: true
    };
    
    setMessages(prev => [...(prev || []), optimisticMessage]);
    scrollToBottom();

    setSending(true);
    const res = await sendMessage({
      conversationId: currentConvoId,
      content: content,
      imageUrl: imageUrl || undefined
    });

    if (res && res.success) {
      loadMessages(currentConvoId, true);
    } else {
      setMessages(prev => (prev || []).filter(m => m.id !== optimisticMessage.id));
    }
    setSending(false);
  };

  const activeConvo = (conversations || []).find(c => c?.id === currentConvoId);

  const formatTime = (dateStr: string | null | undefined) => {
    try {
      if (!dateStr) return "--:--";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "--:--";
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "--:--";
    }
  };

  // 🚀 NO FULL-SCREEN BLOCKING: Show the shell immediately even if data is loading
  // (We'll handle specific loading states within components)

  return (
    <div className="glass-panel" style={{ height: '700px', display: 'flex', overflow: 'hidden', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
      
      {/* Sidebar: Chat List */}
      <div style={{ width: '320px', borderRight: '1.5px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
           <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>{t?.merchant_messages?.title || "Messages"}</h2>
           <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={16} />
              <input 
                placeholder={t?.merchant_messages?.search || "Search contacts..."} 
                className="input-field" 
                style={{ paddingLeft: '2.5rem', fontSize: '0.9rem', borderRadius: '10px' }} 
              />
           </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
           {(!conversations || conversations.length === 0) ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{t?.merchant_messages?.empty || "No conversation history"}</div>
           ) : (
             conversations.map(c => (
               <div 
                 key={c?.id} 
                 onClick={() => setCurrentConvoId(c?.id)}
                 style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', cursor: 'pointer', backgroundColor: currentConvoId === c?.id ? 'var(--bg-secondary)' : 'transparent', borderLeft: `4px solid ${currentConvoId === c?.id ? 'var(--accent-color)' : 'transparent'}`, transition: 'all 0.2s' }}
               >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 800 }}>
                    {c?.customer?.name?.[0] || 'U'}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c?.customer?.name || t?.common?.unknownUser || "Unknown User"}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{formatTime(c?.updatedAt)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                       {c?.messages?.[0]?.content || t?.merchant_messages?.startPrompt || "No messages yet"}
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
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{activeConvo?.customer?.name || t?.merchant_messages?.targetName || "Connecting..."}</div>
                    <div style={{ fontSize: '0.7rem', color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#facc15' }}></div> {t?.common?.online || "Online"}
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
               {(messages || []).map(m => (
                 <div key={m?.id} style={{ alignSelf: m?.senderId === userId ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ padding: '0.75rem 1rem', borderRadius: '16px', backgroundColor: m?.senderId === userId ? 'var(--accent-color)' : 'var(--surface-1)', color: m?.senderId === userId ? 'white' : 'var(--text-primary)', border: m?.senderId === userId ? 'none' : '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>
                       {m?.imageUrl && (
                         <img 
                           src={m.imageUrl} 
                           alt="Attached" 
                           style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: m.content ? '0.5rem' : 0, display: 'block' }} 
                         />
                       )}
                       {m?.content}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'flex', justifyContent: m?.senderId === userId ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '4px' }}>
                       {formatTime(m?.createdAt)}
                       {m?.senderId === userId && (m?.isRead ? <CheckCheck size={12} color="#facc15" /> : <Check size={12} />)}
                    </div>
                 </div>
               ))}
            </div>

            {/* Input */}
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-1)', borderTop: '1.5px solid var(--border-color)' }}>
               {/* Image Preview */}
               {selectedImage && (
                 <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                   <img src={selectedImage} style={{ height: '60px', borderRadius: '8px' }} alt="Preview" />
                   <div 
                     onClick={() => setSelectedImage(null)}
                     style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                   >✕</div>
                 </div>
               )}

               <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem' }}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                    <Paperclip size={20} className="cursor-pointer" style={{ cursor: 'pointer' }} onClick={handleFileClick} />
                    <ImageIcon size={20}  className="cursor-pointer" style={{ cursor: 'pointer' }} onClick={handleFileClick} />
                  </div>
                  <input 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={t?.merchant_messages?.inputPlaceholder || "Type a message..."} 
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
             <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{t?.merchant_messages?.selectChat || "Select a dialogue to begin"}</h3>
             <p style={{ maxWidth: '300px', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t?.merchant_messages?.selectChatDesc || "Communicate details, upload photos, or ask service-related questions."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
