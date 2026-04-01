"use client";

import { useEffect, useState } from 'react';
import { RefreshCw, PlayCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    console.error("Dashboard Dynamic Sync Delay:", error);
    
    // Silent auto-retry for pool issues
    const isDbPoolIssue = error.message?.includes("pool") || error.message?.includes("client");
    if (isDbPoolIssue) {
      const timer = setTimeout(() => {
        setRetrying(true);
        reset();
      }, 3000); // Wait 3s and try again silently
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  return (
    <div className="glass-panel animate-fade-in" style={{ 
      padding: '2rem', 
      borderRadius: '24px', 
      border: '1.5px solid rgba(239, 68, 68, 0.1)',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      marginTop: '2rem',
      textAlign: 'center'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <RefreshCw size={20} className={retrying ? "animate-spin" : ""} />
        正在嘗試優化您的即時連線...
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        目前的伺服器連線較為繁忙，系統正在背景自動排隊處理您的請求。請稍候，數據將在加載完成後自動呈現。
      </p>
      <button
        onClick={() => reset()}
        disabled={retrying}
        style={{ 
          padding: '0.75rem 1.5rem', 
          borderRadius: '12px', 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          color: 'white', 
          border: 'none', 
          fontWeight: 700, 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <PlayCircle size={18} />
        {retrying ? "重讀中..." : "手動重新整理"}
      </button>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
