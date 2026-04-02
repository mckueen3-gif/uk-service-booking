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
        <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          {t.onboarding.hero.title}
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.35rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 3.5rem', lineHeight: '1.6', fontWeight: 500 }}>
          {t.onboarding.hero.subtitle}
        </p>

        {/* Social Proof Metrics */}
        <div className="trust-stats">
          <div className="stat-card">
            <div className="icon-box">
              <Users size={20} color="#d4af37" />
            </div>
            <div className="stat-info">
              <span className="stat-val">2,500+</span>
              <span className="stat-lbl">Active Professionals</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box">
              <BadgePercent size={20} color="#d4af37" />
            </div>
            <div className="stat-info">
              <span className="stat-val">8%</span>
              <span className="stat-lbl">Platform Commission</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon-box">
              <Star size={20} color="#d4af37" />
            </div>
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
          padding: 120px 20px 80px;
          text-align: center;
          background-color: #050505;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
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
          gap: 10px;
          padding: 10px 22px;
          background: rgba(212, 175, 55, 0.08);
          color: #d4af37;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.75rem;
          margin-bottom: 36px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
        }

        .trust-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 60px;
          flex-wrap: wrap;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 28px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 20px;
          min-width: 220px;
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }

        .icon-box {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .stat-val {
          color: white;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .stat-lbl {
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 700;
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
          background: #1e293b;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-dot.active {
          width: 40px;
          border-radius: 4px;
          background: linear-gradient(90deg, #d4af37, #b8860b);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }

        .glow-top {
          position: absolute;
          top: -250px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
          filter: blur(40px);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 2;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .onboarding-hero {
            padding: 100px 15px 50px;
          }
          .hero-title {
            font-size: 2.25rem !important;
          }
          .trust-stats {
            gap: 16px;
          }
          .stat-card {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
