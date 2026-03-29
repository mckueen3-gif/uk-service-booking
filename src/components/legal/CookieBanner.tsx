'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";

export default function CookieBanner() {
  const { t, isRTL } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
       const timer = setTimeout(() => setIsVisible(true), 1500);
       return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Simple resize listener for responsive layout without Tailwind
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '960px',
    zIndex: 1000,
    backgroundColor: 'var(--glass-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1.5px solid var(--glass-border)',
    borderRadius: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: isMobile ? '1.5rem' : '1.5rem 2.5rem',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: isMobile ? '1rem' : '2rem',
    direction: isRTL ? 'rtl' : 'ltr',
    animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  };

  const iconContainerStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
    borderRadius: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
  };

  const textContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    textAlign: isMobile ? 'center' : 'inherit'
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    gap: '0.75rem',
    width: isMobile ? '100%' : 'auto'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: isRTL ? 'auto' : '1.25rem',
    left: isRTL ? '1.25rem' : 'auto',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.5rem',
    transition: 'color 0.2s'
  };

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => setIsVisible(false)} 
        style={closeButtonStyle}
        className="hover-text-primary"
      >
        <X size={20} />
      </button>

      <div style={iconContainerStyle}>
        <ShieldCheck color="white" size={32} />
      </div>

      <div style={textContainerStyle}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          我們重視您的隱私 (We value your privacy)
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          我們使用 Cookie 來優化您的預約體驗並分析站點流量。點擊「接受」即表示您同意我們的 
          <Link href="/legal/cookies" style={{ color: 'var(--accent-color)', fontWeight: 700, marginLeft: '4px', textDecoration: 'underline' }}>
            Cookie 政策
          </Link>。
        </p>
      </div>

      <div style={buttonGroupStyle}>
        <button 
          onClick={handleDecline}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            color: 'var(--text-muted)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            order: isMobile ? 2 : 1
          }}
          className="hover-text-primary"
        >
          拒絕 (Decline)
        </button>
        <button 
          onClick={handleAccept}
          className="btn btn-primary"
          style={{ 
            padding: '0.75rem 2rem', 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            order: isMobile ? 1 : 2
          }}
        >
          全部接受 (Accept All) <ArrowRight size={16} />
        </button>
      </div>

      <style jsx>{`
        .hover-text-primary:hover { color: var(--text-primary) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
