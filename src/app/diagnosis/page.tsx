"use client";

import { useTranslation } from '@/components/LanguageContext';
import DiagnosisTool from '@/components/diagnosis/DiagnosisTool';
import { Sparkles, ArrowRight, ShieldCheck, Zap, PoundSterling } from 'lucide-react';
import Link from 'next/link';

export default function DiagnosisPage() {
  const { t, locale } = useTranslation();

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '6rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal active">
           <div style={{ 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: '0.75rem', 
             padding: '0.5rem 1.25rem', 
             background: 'var(--surface-1)', 
             borderRadius: '2rem', 
             boxShadow: 'var(--shadow-sm)',
             fontSize: '0.9rem',
             fontWeight: 800,
             color: 'var(--amber-600)',
             marginBottom: '1.5rem',
             border: '1px solid var(--border-color)'
           }}>
             <Sparkles size={18} /> {t.diagnosis.badge}
           </div>
           
           <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
             {t.diagnosis.title1} <br />
             <span style={{ color: 'var(--amber-600)' }}>{t.diagnosis.title2}</span>
           </h1>
           
           <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>
             {t.diagnosis.subtitle}
           </p>
        </div>

        {/* Main Tool */}
        <div className="stagger-1 reveal active" style={{ marginBottom: '6rem' }}>
          <DiagnosisTool key={locale} />
        </div>

        {/* Features / Why AI? */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
           <div className="glass-panel stagger-2 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <Zap size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t.diagnosis.features.instant.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.diagnosis.features.instant.desc}</p>
           </div>

           <div className="glass-panel stagger-3 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <PoundSterling size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t.diagnosis.features.pricing.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.diagnosis.features.pricing.desc}</p>
           </div>

           <div className="glass-panel stagger-4 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <ShieldCheck size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t.diagnosis.features.verified.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.diagnosis.features.verified.desc}</p>
           </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '6rem' }} className="reveal active">
          <Link href="/services">
             <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)', padding: '1rem 3rem' }}>
               {t.diagnosis.cta} <ArrowRight size={20} />
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
