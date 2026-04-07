"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { processChatMessage } from '@/app/actions/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to ConciergeAI. I am Aura, your elite service assistant. How may I assist you with your UK service needs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Attempt to get city from localStorage or context if available in the app environment
  const [currentCity, setCurrentCity] = useState<string>('');

  useEffect(() => {
    const savedCity = typeof window !== 'undefined' ? localStorage.getItem('user-city') : '';
    if (savedCity) setCurrentCity(savedCity);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the city to allow AI to provide elite merchant recommendations
      const result = await processChatMessage([...messages, userMsg] as any, currentCity);
      if (result.success && (result as any).message) {
        setMessages(prev => [...prev, (result as any).message as Message]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: (result as any).error || "Pologies, I've encountered a connection interruption. Please try again or contact our support." }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* Floating Button - Pearl Gold Glow */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--surface-1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--accent-color)', boxShadow: 'var(--shadow-lg)', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          <MessageSquare size={28} />
          <div style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', border: '2px solid var(--bg-primary)' }}></div>
        </button>
      )}

      {/* Chat Window - Premium Pearl/Obsidian Glass */}
      {isOpen && (
        <div style={{ 
          width: '380px', 
          height: '550px', 
          backgroundColor: 'var(--glass-bg)', 
          backdropFilter: 'blur(32px) saturate(180%)', 
          borderRadius: '24px', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          animation: 'chat-fade-in 0.3s ease-out'
        }}>
          {/* Header - Pearl Gold Gradient */}
          <div style={{ padding: '1.25rem', background: 'var(--surface-1)', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-soft)' }}>
                <Bot size={24} color="var(--accent-color)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                  ConciergeAI <span style={{ color: 'var(--accent-color)' }}>Aura</span> <Sparkles size={14} color="var(--accent-color)" />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.8 }}>Elite Concierge Assistant</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', opacity: 0.6 }}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: msg.role === 'user' ? 'var(--accent-color)' : 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)' }}>
                  {msg.role === 'user' ? <UserIcon size={18} color="var(--text-contrast)" /> : <Bot size={18} color="var(--accent-color)" />}
                </div>
                <div style={{ 
                  maxWidth: '80%', 
                  padding: '0.8rem 1rem', 
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', 
                  backgroundColor: msg.role === 'user' ? 'var(--accent-color)' : 'var(--surface-2)',
                  color: msg.role === 'user' ? 'var(--text-contrast)' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: msg.role === 'user' ? 700 : 400,
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  <Bot size={18} color="var(--accent-color)" />
                </div>
                <div style={{ padding: '0.8rem 1rem', borderRadius: '4px 16px 16px 16px', backgroundColor: 'var(--surface-2)', color: 'var(--accent-color)' }}>
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input - Pearl Style */}
          <form onSubmit={handleSend} style={{ padding: '1.25rem', backgroundColor: 'var(--surface-1)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your concierge..."
              style={{ flex: 1, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
            />
            <button 
              type="submit"
              disabled={isLoading}
              style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--accent-color)', color: 'var(--text-contrast)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style jsx global>{`
        @keyframes chat-fade-in {
          from { opacity: 0; transform: translateY(20px); scale: 0.95; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
      `}</style>
    </div>
  );
}
