"use client";

import { useEffect } from "react";
import { Car, RefreshCw } from "lucide-react";

export default function GarageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Garage Page Error:", error);
  }, [error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "6rem 2rem",
      textAlign: "center",
      gap: "1.5rem"
    }}>
      <div style={{
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        padding: "1.5rem",
        borderRadius: "50%"
      }}>
        <Car size={40} color="var(--accent-color)" />
      </div>

      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          車庫暫時無法載入
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "380px", lineHeight: 1.6 }}>
          連線出現問題。您的車輛資料安全無虞，請點擊下方重試。
        </p>
      </div>

      <button
        onClick={() => reset()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.85rem 1.75rem",
          borderRadius: "14px",
          backgroundColor: "var(--accent-color)",
          color: "white",
          border: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: "pointer"
        }}
      >
        <RefreshCw size={16} />
        重新載入車庫
      </button>
    </div>
  );
}
