'use client';

import React from 'react';
import { useTranslation } from '../LanguageContext';
import { Sparkles, Users, BadgePercent, Star } from 'lucide-react';

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

        {/* Social Proof Metrics */}
        <div className="trust-stats">
          <div className="stat-card">
            <Users size={20} color="#d4af37" />
            <div className="stat-info">
              <span className="stat-val">2,500+</span>
              <span className="stat-lbl">Active Professionals</span>
            </div>
          </div>
          <div className="stat-card">
            <BadgePercent size={20} color="#d4af37" />
            <div className="stat-info">
              <span className="stat-val">8%</span>
              <span className="stat-lbl">Platform Commission</span>
            </div>
          </div>
          <div className="stat-card">
            <Star size={20} color="#d4af37" />
            <div className="stat-info">
              <span className="stat-val">4.8/5</span>
              <span className="stat-lbl">Expert Rating</span>
            </div>
          </div>
        </div>
        
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

        .trust-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .stat-val {
          color: white;
          font-weight: 900;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
        }

        .stat-lbl {
          color: #666;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          .trust-stats {
            gap: 15px;
          }
          .stat-card {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
