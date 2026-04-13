"use client";

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Copy, MessageSquare, Globe } from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

export default function ShareProfile({ merchantId, companyName }: { merchantId: string, companyName: string }) {
  const { t, isRTL } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/merchant/${merchantId}`;
  const shareText = `Check out ${companyName} on ConciergeAI! The top 1% verified experts for your needs.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareActions = [
    { 
      name: 'WhatsApp', 
      icon: <MessageSquare size={18} fill="none" color="#25D366" />, 
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` 
    },
    { 
      name: 'Facebook', 
      icon: <Globe size={18} fill="none" color="#1877F2" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` 
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--accent-color)33', textAlign: isRTL ? 'right' : 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
         <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--accent-soft)', color: 'var(--accent-color)' }}>
            <Share2 size={18} />
         </div>
         <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{t.merchant.merchant_profile.share.title}</h3>
      </div>
      
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        {t.merchant.merchant_profile.share.subtitle}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row', marginBottom: '1rem' }}>
        {shareActions.map((action, idx) => (
          <a 
            key={idx} 
            href={action.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem', 
              borderRadius: '0.75rem', 
              backgroundColor: 'var(--surface-2)', 
              border: '1px solid var(--border-color)',
              color: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            {action.icon} {action.name}
          </a>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            readOnly 
            value={shareUrl}
            style={{ 
              width: '100%', 
              padding: '0.75rem 3rem 0.75rem 1rem', 
              backgroundColor: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '0.75rem', 
              fontSize: '0.8rem', 
              color: 'var(--accent-color)',
              outline: 'none',
              fontFamily: 'monospace'
            }}
          />
          <button 
            onClick={copyToClipboard}
            style={{ 
              position: 'absolute', 
              right: '0.5rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              padding: '0.4rem',
              borderRadius: '6px',
              backgroundColor: copied ? '#10b981' : 'var(--surface-3)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
      </div>
    </div>
  );
}
