"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, TrendingUp, ArrowDownCircle, History, 
  Info, Loader2, CreditCard, ChevronRight, 
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { getEarningsStats } from "@/app/actions/finance";
import Link from "next/link";

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getEarningsStats();
    if (res.wallet || res.recentBookings) setData(res);
    setLoading(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  const wallet = data?.wallet || { totalEarned: 0, availableBalance: 0, pendingBalance: 0 };
  const jobs = data?.merchant?.completedJobsCount || 0;

  const getTierInfo = () => {
    return { label: "精英專家 (Elite Merchant)", rate: "9%", next: "已達標準費率" };
  };

  const tier = getTierInfo();

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>收入統計 (Earnings)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>管理您的錢包、查看交易流水與申請提領</p>
        </div>
        <Link href="/dashboard/earnings/payout" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
           <ArrowDownCircle size={18} /> 申請提領
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
              <Wallet size={100} color="var(--accent-color)" />
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>可用餘額 (Available)</p>
           <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>£{wallet.availableBalance.toFixed(2)}</h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#facc15' }}>
              <CheckCircle2 size={14} /> 可隨時提領
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>累積總收入 (Total Earned)</p>
           <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>£{wallet.totalEarned.toFixed(2)}</h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              <TrendingUp size={14} /> 持續增長中
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(99, 102, 241, 0.05))' }}>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>目前手續費級別 (Tier)</p>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f766e' }}>{tier.label}</h2>
           <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              當前費率: <span style={{ fontWeight: 700 }}>{tier.rate}</span>
           </div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              下一步: {tier.next}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Recent Transactions */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <History size={20} color="var(--accent-color)" />
              <h3 style={{ fontWeight: 800 }}>最近收入紀錄 (Recent Jobs)</h3>
           </div>
           
           {data.recentBookings.length === 0 ? (
             <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>尚無完成的訂單紀錄</p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {data.recentBookings.map((b: any) => (
                 <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Info size={18} color="var(--accent-color)" />
                       </div>
                       <div>
                          <p style={{ fontWeight: 700 }}>{b.service?.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(b.scheduledDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <p style={{ fontWeight: 800, color: '#facc15' }}>+£{b.totalAmount.toFixed(2)}</p>
                       <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>已入帳</p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Payout History / Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>提領紀錄 (Withdrawals)</h3>
              {data.recentWithdrawals.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>尚無提領紀錄</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {data.recentWithdrawals.map((w: any) => (
                     <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                           <p style={{ fontWeight: 600 }}>£{w.amount.toFixed(2)}</p>
                           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(w.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ 
                          color: w.status === 'COMPLETED' ? '#facc15' : w.status === 'PENDING' ? '#f59e0b' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {w.status}
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>

           <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                 <AlertCircle size={18} color="var(--accent-color)" style={{ marginTop: '2px' }} />
                 <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>關於提領</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                       提領申請通常在 1-3 個工作天內處理完畢。請確保您的銀行帳號資訊準確，以避免撥款失敗。
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
