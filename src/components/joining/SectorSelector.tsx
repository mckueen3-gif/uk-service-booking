"use client";

import React from "react";
import { useTranslation } from "../LanguageContext";
import {
  Briefcase,
  GraduationCap,
  Wrench,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface SectorSelectorProps {
  onSelect: (sector: string) => void;
  selectedSector: string | null;
}

export default function SectorSelector({
  onSelect,
  selectedSector,
}: SectorSelectorProps) {
  const { t } = useTranslation();

  const sectors = [
    {
      id: "professional",
      icon: <Briefcase size={32} />,
      title: t?.onboarding?.sectors?.professional?.title || "Professional & Corporate",
      desc: t?.onboarding?.sectors?.professional?.desc || "Accounting, Legal, and Corporate Services.",
      industries: t?.onboarding?.sectors?.professional?.industries || ["Accounting", "Legal"],
      isPremium: true,
    },
    {
      id: "education",
      icon: <GraduationCap size={32} />,
      title: t?.onboarding?.sectors?.education?.title || "Academic & Tutoring",
      desc: t?.onboarding?.sectors?.education?.desc || "Curriculum support and language education.",
      industries: t?.onboarding?.sectors?.education?.industries || ["Academic Tutoring", "Languages"],
      isPremium: false,
    },
    {
      id: "technical",
      icon: <Wrench size={32} />,
      title: t?.onboarding?.sectors?.technical?.title || "Trades & Technical",
      desc: t?.onboarding?.sectors?.technical?.desc || "Plumbing, heating, and renovation services.",
      industries: t?.onboarding?.sectors?.technical?.industries || ["Plumbing", "Electrical"],
      isPremium: false,
    },
  ];

  return (
    <div className="sector-selector">
      <h2 className="section-title">
        {t?.onboarding?.sector_selection_title || "Sector Selection"}{" "}
        <span style={{ color: "#d4af37", opacity: 0.6, fontSize: '0.8em' }}>
          {t?.onboarding?.sector_selection_subtitle || "Professional Domain"}
        </span>
      </h2>

      <div className="sectors-grid">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`sector-card ${selectedSector === sector.id ? "selected" : ""}`}
            onClick={() => onSelect(sector.id)}
            style={{
              backgroundColor:
                selectedSector === sector.id
                  ? "rgba(212, 175, 55, 0.08)"
                  : "rgba(15, 15, 15, 0.6)",
              border:
                selectedSector === sector.id
                  ? "1px solid #d4af37"
                  : "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow:
                selectedSector === sector.id
                  ? "0 10px 40px -10px rgba(212, 175, 55, 0.2)"
                  : "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <div className="card-inner">
              <div
                className="icon-box"
                style={{
                  backgroundColor:
                    selectedSector === sector.id
                      ? "#d4af37"
                      : "rgba(212, 175, 55, 0.1)",
                  color: selectedSector === sector.id ? "black" : "#d4af37",
                }}
              >
                {sector.icon}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <h3
                  className="sector-title"
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 900,
                  }}
                >
                  {sector.title}
                </h3>
                {sector.isPremium && <ShieldCheck size={16} color="#d4af37" />}
              </div>

              <p
                className="sector-desc"
                style={{
                  color: "#a0a0a0",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  fontWeight: 500,
                }}
              >
                {sector.desc}
              </p>

              <div className="industry-tags">
                {sector.industries.map((industry: string, idx: number) => (
                  <span
                    key={idx}
                    className="tag"
                    style={{
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: "#999",
                    }}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {selectedSector === sector.id && (
              <div className="selection-badge">
                <CheckCircle2 size={24} color="#d4af37" />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .sector-selector {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .section-title {
          text-align: center;
          margin-bottom: 50px;
          font-size: 2.2rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.02em;
        }

        .sectors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 2.5rem;
          justify-content: center;
        }

        .sector-card {
          padding: 2.5rem;
          cursor: pointer;
          position: relative;
          text-align: left;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .sector-card:hover {
          background-color: rgba(212, 175, 55, 0.05);
          transform: translateY(-8px);
          border-color: rgba(212, 175, 55, 0.2);
        }

        .icon-box {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .sector-desc {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .industry-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .tag {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .selection-badge {
          position: absolute;
          top: 24px;
          right: 24px;
        }

        @media (max-width: 1200px) {
          .sectors-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 800px) {
          .sectors-grid {
            grid-template-columns: 1fr;
          }
          .sector-card {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
