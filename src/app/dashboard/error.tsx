"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error silently in background
    console.error("Dashboard Background Sync Issue:", error);
  }, [error]);

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.75rem 1.25rem",
      backgroundColor: "#fff",
      border: "1px solid #fee2e2",
      borderRadius: "16px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      animation: "fade-up 0.3s ease-out"
    }}>
      <div style={{ 
        backgroundColor: "#fef2f2", 
        padding: "0.5rem", 
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <AlertCircle size={18} color="#dc2626" />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>數據連線較不穩定 (Sync Delayed)</span>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>您仍可檢視預置資料並操作其他功能。</span>
      </div>

      <button 
        onClick={() => reset()}
        style={{
          marginLeft: "0.5rem",
          padding: "0.5rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#f1f5f9",
          color: "#475569",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title="嘗試重新整理 (Sync Now)"
      >
        <RefreshCw size={16} />
      </button>

      <style jsx>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
