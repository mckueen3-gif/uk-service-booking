'use client';

import React from 'react';
import { useTranslation } from '../LanguageContext';
import { Sparkles } from 'lucide-react';

export default function OnboardingHero() {
  const { t } = useTranslation();

  return (
    <div className="onboarding-hero">
      <div className="hero-content reveal active">
        <div className="premium-badge">
          <Sparkles size={14} color="#d4af37" />
          <span>ConciergeAI Elite Expert</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          {t.onboarding.hero.title}
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.35rem', color: '#888', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6', fontWeight: 500 }}>
          {t.onboarding.hero.subtitle}
        </p>
        
        <div className="step-indicator">
          {[0, 1, 2].map((step) => (
            <div key={step} className={`step-dot ${step === 0 ? 'active' : ''}`} />
          ))}
        </div>
      </div>
      
      {/* Visual Accents */}
      <div className="glow-top" />
      <div className="grid-overlay" />

      <style jsx>{`
        .onboarding-hero {
          padding: 100px 20px 60px;
          text-align: center;
          background-color: #050505;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(212, 175, 55, 0.05);
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(212, 175, 55, 0.05);
          color: #d4af37;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.75rem;
          margin-bottom: 32px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #222;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-dot.active {
          width: 32px;
          border-radius: 4px;
          background: #d4af37;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
        }

        .glow-top {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 2;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .onboarding-hero {
            padding: 80px 15px 40px;
          }
          .hero-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
