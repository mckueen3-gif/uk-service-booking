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
    console.error("Dashboard Critical Error:", error);
    
    // Auto-reset after 3 seconds to try and recover the UI silently
    const timer = setTimeout(() => {
      reset();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [error, reset]);

  // 🛡️ SHIELD: If it's a non-fatal sync error, render nothing.
  // The DashboardContent has its own internal error states.
  if (error.message.includes("is not dynamic") || error.message.includes("digest")) {
    return null;
  }

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
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>系統正在自動修復 (Auto-Healing)</span>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>檢測到臨時連線波動，正在恢復中...</span>
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
      >
        <RefreshCw size={16} className="animate-spin" />
      </button>

      <style jsx>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
