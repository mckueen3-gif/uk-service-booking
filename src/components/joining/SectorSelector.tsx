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
      title: "專業商務 (Accounting & Law)",
      desc: "專為英國海外居民及中小企業提供合規報稅、年度審計及法律諮詢服務。",
      industries: ["Accounting", "Tax", "Legal", "Financial Advisory"],
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
        選擇您的專業領域{" "}
        <span style={{ color: "#d4af37" }}>Sector Selection</span>
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
                  color: "#777",
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
                      color: "#555",
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
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
        }

        .sector-card {
          padding: 2.5rem;
          cursor: pointer;
          position: relative;
          text-align: left;
          height: 100%;
          border-radius: 28px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
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

        .industry-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
        }

        .tag {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .selection-badge {
          position: absolute;
          top: 24px;
          right: 24px;
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
