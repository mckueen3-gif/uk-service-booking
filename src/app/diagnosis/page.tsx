"use client";

import { useTranslation } from '@/components/LanguageContext';
import DiagnosisTool from '@/components/diagnosis/DiagnosisTool';
import { Sparkles, ArrowRight, ShieldCheck, Zap, PoundSterling } from 'lucide-react';
import Link from 'next/link';


export default function DiagnosisPage() {
  const { t, locale } = useTranslation();

  // High-resilience defensive layer for the UI
  const d = t?.diagnosis ?? {};
  const df = d.features ?? {};
  const d_instant = df.instant ?? { title: 'Triage', desc: 'Analyzing...' };
  const d_pricing = df.pricing ?? { title: 'Pricing', desc: 'Estimating...' };
  const d_verified = df.verified ?? { title: 'Experts', desc: 'Matching...' };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      minHeight: '100vh', 
      padding: '8rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Premium Tech Background Decorations */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '600px',
        background: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      <div className="tech-grid" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.15,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, black, transparent)'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="reveal active">
           <div style={{ 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: '0.75rem', 
             padding: '0.6rem 1.5rem', 
             background: 'rgba(212, 175, 55, 0.1)', 
             borderRadius: '2rem', 
             fontSize: '0.85rem',
             fontWeight: 900,
             color: 'var(--amber-600)',
             marginBottom: '2rem',
             border: '1px solid rgba(212, 175, 55, 0.3)',
             backdropFilter: 'blur(8px)',
             letterSpacing: '0.05em',
             textTransform: 'uppercase'
           }}>
             <Sparkles size={16} /> {d.badge || 'AI Diagnosing'}
           </div>
           
           <h1 style={{ 
             fontSize: 'clamp(3rem, 8vw, 5rem)', 
             fontWeight: 950, 
             color: 'var(--text-primary)', 
             marginBottom: '2rem', 
             letterSpacing: '-0.04em', 
             lineHeight: 0.95 
           }}>
             {d.title1 || 'Visual'} <br />
             <span style={{ 
               background: 'linear-gradient(to right, #d4af37, #926207)', 
               WebkitBackgroundClip: 'text', 
               WebkitTextFillColor: 'transparent',
               filter: 'drop-shadow(0 4px 12px rgba(184, 134, 11, 0.2))'
             }}>
               {d.title2 || 'Diagnosis'}
             </span>
           </h1>
           
           <p style={{ 
             maxWidth: '800px', 
             margin: '0 auto', 
             fontSize: '1.4rem', 
             color: 'var(--text-muted)', 
             fontWeight: 500, 
             lineHeight: 1.6,
             letterSpacing: '-0.01em'
           }}>
             {d.subtitle || 'AI-Powered Property & Automotive Health Audit.'}
           </p>
        </div>

        {/* Main Tool Container with glow */}
        <div className="stagger-1 reveal active" style={{ 
          marginBottom: '8rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: '-10px',
            background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1), transparent, rgba(212, 175, 55, 0.1))',
            borderRadius: '2.5rem',
            filter: 'blur(20px)',
            zIndex: -1
          }} />
          <DiagnosisTool key={locale} />
        </div>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
           <div className="glass-panel stagger-2 reveal active hover-up" style={{ padding: '3rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '2rem', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.1)' }}>
                 <Zap size={32} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{d_instant.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{d_instant.desc}</p>
           </div>

           <div className="glass-panel stagger-3 reveal active hover-up" style={{ padding: '3rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '2rem', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.1)' }}>
                 <PoundSterling size={32} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{d_pricing.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{d_pricing.desc}</p>
           </div>

           <div className="glass-panel stagger-4 reveal active hover-up" style={{ padding: '3rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'var(--accent-soft)', color: 'var(--amber-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '2rem', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.1)' }}>
                 <ShieldCheck size={32} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{d_verified.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{d_verified.desc}</p>
           </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', marginTop: '8rem' }} className="reveal active">
          <Link href="/services">
             <button className="btn btn-secondary" style={{ padding: '1.25rem 4rem', fontSize: '1.1rem', borderRadius: '2rem' }}>
               {d.cta || 'Launch AI'} <ArrowRight size={20} />
             </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .tech-grid {
          background-image: 
            linear-gradient(to right, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hover-up {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-up:hover {
          transform: translateY(-10px);
          border-color: var(--amber-600) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
