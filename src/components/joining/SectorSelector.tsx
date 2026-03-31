'use client';

import React from 'react';
import { useTranslation } from '../LanguageContext';
import { Briefcase, GraduationCap, Wrench, CheckCircle2 } from 'lucide-react';

interface SectorSelectorProps {
  onSelect: (sector: string) => void;
  selectedSector: string | null;
}

export default function SectorSelector({ onSelect, selectedSector }: SectorSelectorProps) {
  const { t } = useTranslation();

  const sectors = [
    {
      id: 'professional',
      icon: <Briefcase size={32} />,
      title: t.onboarding.sectors.professional.title,
      desc: t.onboarding.sectors.professional.desc,
      industries: t.onboarding.sectors.professional.industries
    },
    {
      id: 'education',
      icon: <GraduationCap size={32} />,
      title: t.onboarding.sectors.education.title,
      desc: t.onboarding.sectors.education.desc,
      industries: t.onboarding.sectors.education.industries
    },
    {
      id: 'technical',
      icon: <Wrench size={32} />,
      title: t.onboarding.sectors.technical.title,
      desc: t.onboarding.sectors.technical.desc,
      industries: t.onboarding.sectors.technical.industries
    }
  ];

  return (
    <div className="sector-selector">
      <h2 className="section-title">{t.onboarding.sectors.title}</h2>
      
      <div className="sectors-grid">
        {sectors.map((sector) => (
          <div 
            key={sector.id} 
            className={`sector-card glass-panel ${selectedSector === sector.id ? 'selected' : ''}`}
            onClick={() => onSelect(sector.id)}
          >
            <div className="icon-box">
              {sector.icon}
            </div>
            
            <h3 className="sector-title">{sector.title}</h3>
            <p className="sector-desc">{sector.desc}</p>
            
            <div className="industry-tags">
              {sector.industries.map((industry, idx) => (
                <span key={idx} className="tag">{industry}</span>
              ))}
            </div>
            
            {selectedSector === sector.id && (
              <div className="selection-badge">
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .sector-selector {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .section-title {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2rem;
          color: var(--text-primary);
        }

        .sectors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .sector-card {
          padding: 32px;
          cursor: pointer;
          position: relative;
          text-align: left;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sector-card.selected {
          border-color: var(--accent-color);
          background: var(--accent-soft);
          transform: translateY(-8px);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          background: var(--surface-2);
          color: var(--accent-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }

        .sector-card:hover .icon-box {
          background: var(--accent-color);
          color: white;
          transform: rotate(-10deg);
        }

        .sector-title {
          margin-bottom: 12px;
          font-size: 1.5rem;
        }

        .sector-desc {
          color: var(--text-muted);
          margin-bottom: 24px;
          line-height: 1.5;
          flex-grow: 1;
        }

        .industry-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          padding: 4px 12px;
          background: var(--surface-3);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .selection-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          color: var(--accent-color);
        }

        @media (max-width: 640px) {
          .sectors-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
