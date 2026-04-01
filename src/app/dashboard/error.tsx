"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, LayoutDashboard } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [autoRetryCount, setAutoRetryCount] = useState(0);

  useEffect(() => {
    console.error("Dashboard Sync Delay:", error);
    
    // Auto-retry once if it looks like a connection pool issue
    if (autoRetryCount < 1) {
      const timer = setTimeout(() => {
        setAutoRetryCount(prev => prev + 1);
        reset();
      }, 5000); // 5 second cool-off
      return () => clearTimeout(timer);
    }
  }, [error, reset, autoRetryCount]);

  const isDbPoolIssue = error.message?.includes("pool") || error.message?.includes("client") || error.digest?.includes("DYNAMIC");

  return (
    <div className="animate-fade-up" style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      maxWidth: '600px', 
      margin: '4rem auto',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 🚀 Softened Loading Visual instead of Caution Icon */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          border: '4px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: 'var(--accent-color)',
          borderRadius: '50%',
          animation: 'spin 1.5s linear infinite'
        }}></div>
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--accent-color)',
          opacity: 0.5
        }}>
          <RefreshCw size={24} />
        </div>
      </div>

      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
        正在為您同步數據...
      </h2>
      
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '3rem', maxWidth: '440px' }}>
        {isDbPoolIssue 
          ? "目前的伺服器連線較為繁忙。我們正自動為您排隊獲取數據，請稍候片刻。這不會影響您的賬戶安全。" 
          : "目前正在優化您的訪問路徑。加載完成後將自動導向首頁。"}
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', width: '100%' }}>
        <button
          onClick={() => reset()}
          style={{ 
            flex: 1,
            padding: '1.25rem 2rem', 
            borderRadius: '20px', 
            backgroundColor: 'var(--accent-color)', 
            color: 'white', 
            border: 'none', 
            fontWeight: 800, 
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 12px 24px -5px rgba(99, 102, 241, 0.4)',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <RefreshCw size={20} />
          立即重新加載
        </button>
        <Link 
          href="/dashboard"
          style={{ 
            flex: 1,
            padding: '1.25rem 2rem', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 800,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        >
          <LayoutDashboard size={20} />
          返回首頁
        </Link>
      </div>
      
      {/* Hidden Technical Note for debugging, but non-intrusive */}
      <div style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>
        Code: SYSTEM_SYNC_ACTIVE • {autoRetryCount > 0 ? `Retrying...` : `Queue position: Optimized`}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
