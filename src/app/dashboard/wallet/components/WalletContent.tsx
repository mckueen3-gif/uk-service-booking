"use client";

import { useState, useEffect } from "react";
import { Wallet, Gift, Copy, History, CreditCard, Ticket, ArrowUpRight, ArrowDownLeft, Loader2, TrendingUp } from "lucide-react";
import VoucherForm from "../VoucherForm";

export default function WalletContent() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

  // 🚀 INSTANT FACTS: Load from local cache FIRST
  useEffect(() => {
    const cached = localStorage.getItem('wallet_data');
    if (cached) {
      try {
        setStats(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Wallet cache corrupted");
      }
    }

    // 🚀 BACKGROUND SYNC
    async function syncWallet() {
      try {
        const res = await fetch('/api/wallet');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          localStorage.setItem('wallet_data', JSON.stringify(data));
          setSynced(true);
        }
      } catch (e) {
        console.error("Wallet sync failed", e);
      } finally {
        setLoading(false);
      }
    }
    syncWallet();
  }, []);

  if (!stats && loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', width: '100%' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Sync Status (Professional) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ fontSize: '0.8rem', color: synced ? '#10b981' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           {synced ? "● 錢包數據已同步 (Balance Verified)" : "○ 正在連線銀行數據 (Syncing balance...)"}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Main Balance Card */}
        <div className="glass-panel" style={{ 
          padding: '2.5rem', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
            <Wallet size={160} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', opacity: 0.8 }}>
            <CreditCard size={20} />
            <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>AVAILABLE CREDITS</span>
          </div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, verticalAlign: 'top', marginRight: '0.5rem' }}>£</span>
            <span style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{stats?.referralCredits?.toFixed(2) || "0.00"}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>
                <TrendingUp size={16} /> +12% vs last month
             </div>
             <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>可用於折抵下一次服務</div>
          </div>
        </div>

        {/* Voucher & Referral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#fdf2f2', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Ticket size={24} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>兌換優惠碼</h2>
            </div>
            <VoucherForm />
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#eef2ff', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Gift size={24} color="#6366f1" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>推薦好友，享 2% 回饋</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px dashed #6366f1' }}>
              <span style={{ fontWeight: 900, color: '#6366f1', fontSize: '1.2rem' }}>{stats?.referralCode}</span>
              <Copy size={20} color="#6366f1" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <History size={24} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>點數明細 (Transaction History)</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>類型</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>說明</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>金額</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>日期</th>
              </tr>
            </thead>
            <tbody>
              {stats?.creditTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>目前尚無交易紀錄</td>
                </tr>
              ) : (
                stats?.creditTransactions?.map((tx: any) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '1.5rem 0' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {tx.amount > 0 ? (
                            <ArrowDownLeft size={16} color="#10b981" />
                          ) : (
                            <ArrowUpRight size={16} color="#ef4444" />
                          )}
                          <span style={{ fontWeight: 700 }}>{tx.type}</span>
                       </div>
                    </td>
                    <td style={{ padding: '1.5rem 0', color: '#64748b' }}>{tx.description}</td>
                    <td style={{ padding: '1.5rem 0', color: tx.amount > 0 ? '#10b981' : '#ef4444', fontWeight: 800 }}>
                      {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '1.5rem 0', color: '#94a3b8' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
