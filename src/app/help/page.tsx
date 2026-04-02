'use client';

import React from 'react';
import SmartFAQ from '@/components/SmartFAQ';
import { Search, Mail, Phone, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";

export default function HelpPage() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="bg-secondary min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-secondary)', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#0f172a', padding: '8rem 1rem 6rem 1rem', textAlign: 'center' }}>
        <div className="max-w-4xl" style={{ margin: '0 auto' }}>
          <div className="inline-flex items-center gap-2" style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '2rem', color: '#60a5fa', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', display: 'inline-flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <LifeBuoy size={16} /> {t.hero.badge}
          </div>
          <h1 className="hero-title" style={{ color: '#ffffff', marginBottom: '1.5rem', background: 'none', WebkitTextFillColor: 'initial' }}>
            {t.hero.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '40rem', margin: '0 auto' }}>
            {t.hero.subtitle}
          </p>
          
          <div className="mt-12" style={{ position: 'relative', maxWidth: '42rem', margin: '3rem auto 0' }}>
            <Search style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={24} />
            <input 
              type="text" 
              placeholder={t.hero.searchPlaceholder} 
              className="w-full"
              style={{ padding: `1.5rem ${isRTL ? '1rem' : '4rem'} 1.5rem ${isRTL ? '4rem' : '1rem'}`, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '2rem', color: '#ffffff', fontSize: '1.1rem', outline: 'none', textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
        <SmartFAQ />
      </div>

      {/* Support Channels */}
      <div className="container" style={{ marginTop: '6rem', maxWidth: '1200px' }}>
        <div className="grid gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '2.5rem', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'inherit' }}>
            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '1rem', width: 'fit-content' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{t.footer.contact} (Email)</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>24 小時內回覆您的諮詢，處理深度法律或帳務問題。</p>
            <a href="mailto:support@conciergeai.uk" style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none' }}>support@conciergeai.uk</a>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '2.5rem', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'inherit' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '1rem', width: 'fit-content' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>緊急聯繫</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>僅限於正在進行中的服務緊急狀況，我們提供即時語音支援。</p>
            <p style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.95rem' }}>+44 (0) 20 1234 5678</p>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '2.5rem', backgroundColor: '#ffffff', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'inherit' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', color: '#1e293b', borderRadius: '1rem', width: 'fit-content' }}>
              <LifeBuoy size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{t.footer.legal}</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>查閱完整的服務協議、隱私政策與權利保障聲明。</p>
            <Link href="/legal/terms" style={{ color: '#1e293b', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'underline' }}>查看條款文件 →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
