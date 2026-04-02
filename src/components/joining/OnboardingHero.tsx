'use client';

import React from 'react';
import { useTranslation } from '../LanguageContext';

export default function OnboardingHero() {
  const { t } = useTranslation();

  return (
    <div className="onboarding-hero">
      <div className="hero-content reveal active">
        <span className="badge">ConciergeAI Professional</span>
        <h1 className="hero-title">{t.onboarding.hero.title}</h1>
        <p className="hero-subtitle">{t.onboarding.hero.subtitle}</p>
        
        <div className="step-indicator">
          {[0, 1, 2].map((step) => (
            <div key={step} className={`step-dot ${step === 0 ? 'active' : ''}`} />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .onboarding-hero {
          padding: 80px 20px 40px;
          text-align: center;
          background: radial-gradient(circle at top, var(--emerald-50) 0%, transparent 70%);
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--accent-soft);
          color: var(--accent-color);
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero-title {
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--surface-3);
          transition: all 0.3s ease;
        }

        .step-dot.active {
          width: 24px;
          border-radius: 4px;
          background: var(--accent-color);
        }

        @media (max-width: 768px) {
          .onboarding-hero {
            padding: 60px 15px 30px;
          }
        }
      `}</style>
    </div>
  );
}
