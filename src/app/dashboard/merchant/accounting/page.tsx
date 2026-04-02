"use client";

import { 
  Calculator, 
  BarChart, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Zap, 
  Receipt, 
  CreditCard,
  CloudUpload,
  ArrowRight
} from "lucide-react";
import TaxMetricCard from "./components/TaxMetricCard";

export default function AccountingPage() {
  const isPremium = false; // Locked by default as requested

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            會計與稅務 <span style={{ color: '#d4af37' }}>Accounting & Tax</span>
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500 }}>
            自動化英國稅務管理中心：VAT 監測、支出分類與報稅預計。
          </p>
        </div>
        {!isPremium && (
          <div style={{ 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px', 
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#d4af37',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={14} /> 狀態：未激活 (Inactive)
          </div>
        )}
      </div>

      {/* Main Grid with Blur effect if not premium */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem',
        filter: !isPremium ? 'blur(4px)' : 'none',
        pointerEvents: !isPremium ? 'none' : 'auto',
        opacity: !isPremium ? 0.4 : 1,
        transition: 'all 0.4s ease'
      }}>
        <TaxMetricCard 
          title="預計營收 (Gross Revenue)" 
          value="£--.---" 
          description="來自 ConciergeAI 平臺的總入帳金額" 
          icon={<BarChart size={24} />} 
          isLocked={!isPremium}
        />
        <TaxMetricCard 
          title="預留稅金 (Tax Liability)" 
          value="£--.---" 
          description="建議保留的 Self-Assessment 預備金 (20%)" 
          icon={<ShieldCheck size={24} />} 
          isLocked={!isPremium}
        />
        <TaxMetricCard 
          title="VAT 註冊監測 (VAT Radar)" 
          value="--%" 
          description="距離註冊閾值 (£90,000) 的剩餘額度" 
          icon={<Calculator size={24} />} 
          isLocked={!isPremium}
        />
      </div>

      {/* Premium Paywall Overlay */}
      {!isPremium && (
        <div style={{ 
          position: 'absolute', 
          top: '250px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          maxWidth: '600px', 
          zIndex: 10,
          textAlign: 'center'
        }}>
          <div className="glass-panel" style={{ 
            padding: '4rem 3rem', 
            borderRadius: '32px', 
            backgroundColor: 'rgba(10, 10, 10, 0.8)', 
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(212, 175, 55, 0.1)'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: 'rgba(212, 175, 55, 0.1)', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2rem',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <Zap size={32} color="#d4af37" fill="#d4af3730" />
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
              解鎖專業稅務助手 <span style={{ color: '#d4af37' }}>Premium</span>
            </h2>
            <p style={{ color: '#999', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              自動化記帳、支出 AI 掃描與英國稅務合規監測。<br />
              讓您專注於服務，稅收問題由我們搞定。
            </p>
            
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.03)', 
              padding: '1.5rem', 
              borderRadius: '20px', 
              marginBottom: '2.5rem',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.5rem' }}>專業版定價</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                £4.99 <span style={{ fontSize: '1rem', color: '#666' }}>/ 每個月 (Monthly)</span>
              </div>
            </div>

            <button style={{ 
              width: '100%', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
              color: 'black', 
              fontWeight: 900, 
              fontSize: '1.1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }} className="hover-lift">
              即刻升級解鎖 (Upgrade Now) <ArrowRight size={20} />
            </button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#444', fontWeight: 500 }}>
              * 付費功能將於會計師商戶入駐後正式開放，敬請期待。
            </p>
          </div>
        </div>
      )}

      {/* Feature Cards Grid (Visible but non-interactive and slightly dimmed) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: '2.5rem',
        opacity: 0.2,
        pointerEvents: 'none'
      }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <Receipt size={20} color="#d4af37" />
            <h4 style={{ color: 'white', fontWeight: 800 }}>AI 支出掃描 (AI Expense Radar)</h4>
          </div>
          <div style={{ height: '100px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #222' }}>
            <CloudUpload size={24} color="#333" />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <CreditCard size={20} color="#d4af37" />
            <h4 style={{ color: 'white', fontWeight: 800 }}>連接銀行帳戶 (Bank Sync)</h4>
          </div>
          <div style={{ height: '30px', width: '60%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px' }} />
        </div>
      </div>

    </div>
  );
}
