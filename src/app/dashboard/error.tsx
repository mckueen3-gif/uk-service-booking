"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Captured:", error);
  }, [error]);

  return (
    <div className="animate-fade-up" style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      maxWidth: '600px', 
      margin: '4rem auto',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        backgroundColor: 'rgba(245, 158, 11, 0.1)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '0 auto 2rem'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>歡迎回來，頁面正在緩衝中...</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
        目前的伺服器連線稍微擁擠（可能是資料庫正在同步數據）。這不會影響您的資產安全，請點擊下方按鈕重新讀取頁面。
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{ 
            padding: '1rem 2rem', 
            borderRadius: '16px', 
            backgroundColor: 'var(--accent-color)', 
            color: 'white', 
            border: 'none', 
            fontWeight: 700, 
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          重新整理連線
        </button>
        <Link 
          href="/"
          style={{ 
            padding: '1rem 2rem', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(255,255,255,0.05)', 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: 700,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          返回首頁
        </Link>
      </div>
      
      <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
        錯誤代碼: DB_CON_POOL_SATURATED
      </p>
    </div>
  );
}
