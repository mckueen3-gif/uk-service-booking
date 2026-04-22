"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Building2, 
  Car, 
  Search,
  LayoutGrid,
  List,
  AlertTriangle
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import AssetCard from "./components/AssetCard";

interface EquipmentClientProps {
  initialProperties: any[];
  initialVehicles: any[];
}

export default function EquipmentClient({
  initialProperties,
  initialVehicles
}: EquipmentClientProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"property" | "vehicle">("property");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const assets = activeTab === "property" ? initialProperties : initialVehicles;

  const calculateHealth = (asset: any) => {
    // Dummy logic for simulation
    const age = activeTab === "property" ? (asset.boilerAge || 10) : (2024 - parseInt(asset.year || "2015"));
    let score = 100 - (age * 3);
    if (asset.notes?.length > 100) score -= 10;
    return Math.max(minScore(score), 45);
  };

  const minScore = (s: number) => Math.min(s, 98);

  return (
    <div style={{ paddingBottom: "5rem", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ── Sub-Header / Hero ─────────────────────────────────── */}
      <div style={{ 
        background: "var(--surface-1)", 
        borderBottom: "1px solid var(--border-color)",
        padding: "3rem 0 2rem",
        marginBottom: "2rem"
      }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                {t.equipment_mgmt.title}
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                {t.equipment_mgmt.subtitle}
              </p>
            </div>
            <button style={{
              background: "var(--accent-color)",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-lg)",
              border: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <Plus size={20} />
              {t.equipment_mgmt.addBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* ── Controls / Tabs ──────────────────────────────────── */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "2rem",
          background: "var(--surface-1)",
          padding: "0.5rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => setActiveTab("property")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: activeTab === "property" ? "var(--bg-secondary)" : "transparent",
                color: activeTab === "property" ? "var(--accent-color)" : "var(--text-secondary)",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s"
              }}
            >
              <Building2 size={18} />
              {t.equipment_mgmt.propertyTab}
            </button>
            <button 
              onClick={() => setActiveTab("vehicle")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: activeTab === "vehicle" ? "var(--bg-secondary)" : "transparent",
                color: activeTab === "vehicle" ? "var(--accent-color)" : "var(--text-secondary)",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s"
              }}
            >
              <Car size={18} />
              {t.equipment_mgmt.vehicleTab}
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", paddingRight: "0.5rem" }}>
             <button 
              onClick={() => setViewMode("grid")}
              style={{ padding: "0.4rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: viewMode === "grid" ? "var(--bg-secondary)" : "transparent", cursor: "pointer", color: viewMode === "grid" ? "var(--accent-color)" : "var(--text-secondary)" }}
             >
               <LayoutGrid size={18} />
             </button>
             <button 
              onClick={() => setViewMode("list")}
              style={{ padding: "0.4rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: viewMode === "list" ? "var(--bg-secondary)" : "transparent", cursor: "pointer", color: viewMode === "list" ? "var(--accent-color)" : "var(--text-secondary)" }}
             >
               <List size={18} />
             </button>
          </div>
        </div>

        {/* ── Asset Grid ────────────────────────────────────────── */}
        {assets.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "5rem 2rem", 
            background: "var(--surface-1)", 
            borderRadius: "var(--radius-2xl)",
            border: "2px dashed var(--border-color)"
          }}>
            <div style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              <AlertTriangle size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {t.equipment_mgmt.noAssets}
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Add your first {activeTab} to start AI-driven maintenance tracking.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(320px, 1fr))" : "1fr", 
            gap: "1.5rem" 
          }}>
            {assets.map((asset) => (
              <AssetCard 
                key={asset.id}
                type={activeTab === "property" ? (asset.type?.includes("Commercial") ? "commercial" : "house") : "car"}
                title={activeTab === "property" ? asset.address : `${asset.make} ${asset.model}`}
                subtitle={activeTab === "property" ? `${asset.type || "Residential"}` : `${asset.year} • ${asset.reg || "Private Plate"}`}
                healthScore={calculateHealth(asset)}
                lastService={activeTab === "vehicle" ? (asset.lastService ? new Date(asset.lastService).toLocaleDateString() : undefined) : undefined}
                nextService={activeTab === "vehicle" ? (asset.motDate ? new Date(asset.motDate).toLocaleDateString() : undefined) : undefined}
                notes={asset.notes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
