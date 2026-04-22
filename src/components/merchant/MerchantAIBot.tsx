"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Loader2, Sparkles, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { processChatMessage } from '@/app/actions/chat';

interface MerchantAIBotProps {
  merchantId: string;
  merchantName: string;
}

export default function MerchantAIBot({ merchantId, merchantName }: MerchantAIBotProps) {
  const searchParams = useSearchParams();
  const locale = searchParams.get('lang') || 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await processChatMessage({
        messages: [...messages, { role: 'user', content: userMsg }] as any,
        merchantId: merchantId,
        locale: locale
      });

      if (res.success && res.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.message!.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a technical glitch. Please try messaging the expert directly!" }]);
      }
    } catch (err) {
      console.error("AI Assistant Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="hover-scale"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #f5e07a)',
          color: '#000', border: 'none', cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
      >
        <div style={{ position: 'relative' }}>
          <Cpu size={32} />
          <Sparkles size={16} style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
        </div>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      width: '380px', height: '550px', 
      backgroundColor: 'var(--surface-1)', borderRadius: '24px',
      border: '1.5px solid var(--gold-500)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header */}
      <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #d4af37, #f5e07a)', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#000', color: '#d4af37', padding: '4px', borderRadius: '8px' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>{merchantName} AI</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8 }}>EXPERT ASSISTANT (24/7)</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', opacity: 0.6 }}>
            <Sparkles size={32} style={{ margin: '0 auto 1rem', color: 'var(--gold-400)' }} />
            <p style={{ fontSize: '0.85rem' }}>Hi! I'm the AI assistant for <b>{merchantName}</b>. Ask me anything about our services, experience, or availability!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{ 
              padding: '0.75rem 1rem', borderRadius: '16px',
              backgroundColor: m.role === 'user' ? 'var(--gold-500)' : 'var(--surface-2)',
              color: m.role === 'user' ? '#000' : 'var(--text-primary)',
              fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5,
              border: m.role === 'user' ? 'none' : '1px solid var(--border-color)'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: 'var(--surface-2)', borderRadius: '12px', color: 'var(--gold-400)' }}>
            <Loader2 size={16} className="animate-spin" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Analyzing Expert Data...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '1rem', backgroundColor: 'var(--surface-1)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about qualifications, services..."
            style={{ 
              flex: 1, padding: '0.75rem 1rem', borderRadius: '12px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', fontSize: '0.85rem'
            }}
          />
          <button type="submit" disabled={loading} style={{ 
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'var(--gold-500)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer'
          }}>
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* Footer */}
      <div style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        Complex question? <span style={{ color: 'var(--gold-400)', fontWeight: 800, cursor: 'pointer' }}>Message Expert Directly</span>
      </div>
    </div>
  );
}
