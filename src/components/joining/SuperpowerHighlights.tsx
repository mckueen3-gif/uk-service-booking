'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Wand2, 
  Calculator, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

const SuperpowerHighlights = () => {
  const { t } = useTranslation();
  const hDict = (t as any).merchant.onboarding_highlights;

  const superpowers = [
    {
      icon: <Zap size={32} color="#d4af37" />,
      title: hDict.lead_fee_title,
      desc: hDict.lead_fee_desc,
      detail: hDict.leads_comparison,
      accent: "#d4af37"
    },
    {
      icon: <Wand2 size={32} color="#38bdf8" />,
      title: hDict.ai_assistant_title,
      desc: hDict.ai_assistant_desc,
      detail: "+15% Deal Closure Automation",
      accent: "#38bdf8"
    },
    {
      icon: <Calculator size={32} color="#10b981" />,
      title: hDict.financial_tools_title,
      desc: hDict.financial_tools_desc,
      detail: "HMRC Compliant Logic Built-in",
      accent: "#10b981"
    }
  ];

  return (
    <div style={{ padding: '40px 0', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px' }}>{hDict.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>{hDict.subtitle}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {superpowers.map((p, idx) => (
          <div 
            key={idx}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '32px',
              padding: '32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="superpower-card"
          >
            <div style={{ 
              backgroundColor: `${p.accent}11`, 
              padding: '16px', 
              borderRadius: '24px',
              marginBottom: '24px',
              border: `1px solid ${p.accent}22`
            }}>
              {p.icon}
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>{p.title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>{p.desc}</p>
            
            <div style={{ 
              marginTop: 'auto', 
              padding: '10px 20px', 
              borderRadius: '100px', 
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={14} color={p.accent} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.accent }}>{p.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .superpower-card:hover {
          background-color: rgba(255, 255, 255, 0.04);
          transform: translateY(-8px);
          border-color: rgba(212, 175, 55, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
};

export default SuperpowerHighlights;
