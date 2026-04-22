"use client";

import React from "react";
import { 
  Building2, 
  Car, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Activity,
  AlertCircle,
  Wrench
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import Link from "next/link";

interface AssetCardProps {
  type: "house" | "commercial" | "car" | "van";
  title: string;
  subtitle: string;
  lastService?: string;
  nextService?: string;
  healthScore: number; // 0-100
  notes?: string;
}

export default function AssetCard({
  type,
  title,
  subtitle,
  lastService,
  nextService,
  healthScore,
  notes
}: AssetCardProps) {
  const { t } = useTranslation();
  
  const isVehicle = type === "car" || type === "van";
  const icon = isVehicle ? <Car size={24} /> : <Building2 size={24} />;
  
  const getStatusColor = (score: number) => {
    if (score >= 90) return "#10b981"; // Green
    if (score >= 70) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const statusColor = getStatusColor(healthScore);

  return (
    <div
      style={{
        background: "var(--surface-1)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
      className="asset-card-hover"
    >
      {/* Header with Type Icon */}
      <div style={{ padding: "1.5rem", paddingBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ 
          width: "48px", 
          height: "48px", 
          borderRadius: "1rem", 
          background: "var(--bg-secondary)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "var(--accent-color)",
          border: "1px solid var(--border-color)"
        }}>
          {icon}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t.equipment_mgmt.healthScore}
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: statusColor }}>
            {healthScore}%
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>{title}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>{subtitle}</p>

        {/* Status Pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            <Calendar size={14} style={{ color: "var(--accent-color)" }} />
            <span style={{ fontWeight: 500 }}>{t.equipment_mgmt.lastService}:</span>
            <span style={{ color: "var(--text-secondary)" }}>{lastService || "N/A"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", color: "var(--text-primary)" }}>
            <Activity size={14} style={{ color: statusColor }} />
            <span style={{ fontWeight: 500 }}>{t.equipment_mgmt.nextService}:</span>
            <span style={{ color: "var(--text-secondary)" }}>{nextService || "AI Analyzing..."}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div style={{ 
        marginTop: "auto", 
        padding: "1rem 1.5rem", 
        borderTop: "1px solid var(--border-color)", 
        background: "rgba(0,0,0,0.02)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link 
          href={`/diagnosis?assetId=${title}`} 
          style={{ 
            textDecoration: "none", 
            fontSize: "0.85rem", 
            fontWeight: 700, 
            color: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}
        >
          {t.equipment_mgmt.diagnoseBtn}
          <ArrowRight size={14} />
        </Link>
        
        <button style={{ 
          background: "none", 
          border: "none", 
          padding: 0, 
          cursor: "pointer", 
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center"
        }}>
          <Wrench size={16} />
        </button>
      </div>

      <style jsx>{`
        .asset-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-color);
        }
      `}</style>
    </div>
  );
}
