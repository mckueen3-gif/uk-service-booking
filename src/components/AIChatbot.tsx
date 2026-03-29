"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, MessageSquare, RotateCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Aura, your UK Service Concierge. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    { label: '如何退款？', query: '如何申請退款？退款流程是什麼？' },
    { label: '維修有爭議？', query: '如果對維修品質或價格有爭議，該如何處理？' },
    { label: '保固條款', query: '平台提供的服務有保固嗎？' },
    { label: '關於預約', query: '我該如何預約附近的技師？' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#0f766e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        className={isOpen ? "rotate-90" : "hover-scale"}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="animate-fade-up"
          style={{
            position: 'absolute',
            bottom: '80px',
            right: 0,
            width: '380px',
            height: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '1.25rem', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Sparkles size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.025em' }}>Aura Concierge</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                Online & Ready to assist
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '10px', 
                  backgroundColor: m.role === 'user' ? '#0f766e' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {m.role === 'user' ? <User size={16} color="white" /> : <MessageSquare size={16} color="#0f766e" />}
                </div>
                <div style={{ 
                  maxWidth: '80%',
                  padding: '0.875rem 1.125rem',
                  borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  backgroundColor: m.role === 'user' ? '#0f766e' : '#ffffff',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                  <MessageSquare size={16} color="#0f766e" />
                </div>
                <div style={{ padding: '0.875rem', backgroundColor: '#ffffff', borderRadius: '4px 16px 16px 16px', border: '1px solid #e2e8f0' }}>
                  <RotateCw size={16} className="animate-spin" color="#64748b" />
                </div>
              </div>
            )}

            {/* Suggestion Chips */}
            {!isLoading && messages.length < 3 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.query)}
                    style={{
                      padding: '0.5rem 0.8rem',
                      borderRadius: '1rem',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      color: '#0f766e',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="hover:border-teal-500 hover:bg-teal-50"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Aura anything..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.2s'
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                style={{
                  backgroundColor: '#0f172a',
                  color: 'white',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isLoading ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem' }}>
              Secure AI Assistance • Platform Version 1.2
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
