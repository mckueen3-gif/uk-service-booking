"use client";

import { useState, useEffect } from "react";
import { Wallet, Gift, Copy, History, CreditCard, Ticket, ArrowUpRight, ArrowDownLeft, Loader2, TrendingUp, Users, CheckCircle, Sparkles } from "lucide-react";
import VoucherForm from "../VoucherForm";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionary";
import { signOut } from "next-auth/react";

export default function WalletContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = getDictionary(locale as any);
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

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

    async function syncWallet() {
      try {
        const res = await fetch('/api/wallet');
        
        // 🚀 CRITICAL RECOVERY: Clear ghost sessions
        if (res.status === 401 || res.status === 404) {
          localStorage.removeItem('wallet_data');
          await signOut({ redirect: false });
          window.location.href = '/auth/login?error=SessionExpired';
          return;
        }

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
        <div style={{ fontSize: '0.8rem', color: synced ? '#facc15' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           {synced ? `● ${t.merchant.dashboard.wallet.synced}` : `○ ${t.merchant.dashboard.wallet.syncing}`}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
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
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#facc15', fontWeight: 700 }}>
                <TrendingUp size={16} /> +12% vs last month
             </div>
             <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t.merchant.dashboard.wallet.availableNow}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Ticket size={24} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>英國服務禮券兌換</h2>
            </div>
            <VoucherForm />
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.25)', background: 'rgba(99, 102, 241, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                <Gift size={24} color="#6366f1" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t.merchant.dashboard.wallet.referralTitle}</h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {t.merchant.dashboard.wallet.referralDesc}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(99, 102, 241, 0.08)',
              padding: '0.875rem 1.25rem',
              borderRadius: '12px',
              border: '1.5px dashed rgba(99, 102, 241, 0.4)'
            }}>
              <span style={{ fontWeight: 900, color: '#6366f1', fontSize: (stats?.referralCode === "PENDING" || stats?.referralCode === "REF-SYNCING") ? '0.85rem' : '1.15rem', letterSpacing: '0.08em' }}>
                {(!stats?.referralCode || stats.referralCode === "PENDING" || stats.referralCode === "REF-SYNCING") ? (
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{t.merchant.dashboard.wallet.generating}</span>
                ) : (
                  stats.referralCode
                )}
              </span>
              {stats?.referralCode && (
                <button
                  onClick={() => navigator.clipboard.writeText(stats.referralCode)}
                  title="複製推薦碼"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Copy size={20} color="#6366f1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <History size={24} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.merchant.dashboard.wallet.historyTitle}</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.type}</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.description}</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.amount}</th>
                <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.date}</th>
              </tr>
            </thead>
            <tbody>
              {stats?.creditTransactions?.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>{t.merchant.dashboard.wallet.historyEmpty}</td>
                </tr>
              ) : (
                stats?.creditTransactions?.map((tx: any) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '1.5rem 0' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {tx.amount > 0 ? (
                            <ArrowDownLeft size={16} color="#facc15" />
                          ) : (
                            <ArrowUpRight size={16} color="#ef4444" />
                          )}
                          <span style={{ fontWeight: 700 }}>{tx.type}</span>
                       </div>
                    </td>
                    <td style={{ padding: '1.5rem 0', color: '#64748b' }}>{tx.description}</td>
                    <td style={{ padding: '1.5rem 0', color: tx.amount > 0 ? '#facc15' : '#ef4444', fontWeight: 800 }}>
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

      {stats?.referralsMade && stats.referralsMade.length > 0 && (
        <div className="glass-panel animate-fade-up" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: 'rgba(16, 185, 129, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Users size={24} color="#facc15" />
            </div>
            <div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t.merchant.dashboard.wallet.referralListTitle}</h2>
               <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{t.merchant.dashboard.wallet.referralListDesc}</p>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#64748b' }}>
                  <th style={{ paddingBottom: '1.25rem', paddingRight: '1rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.referee}</th>
                  <th style={{ paddingBottom: '1.25rem', paddingRight: '1rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.earned}</th>
                  <th style={{ paddingBottom: '1.25rem', paddingRight: '1rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.expiry}</th>
                  <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>{t.merchant.dashboard.wallet.status}</th>
                </tr>
              </thead>
              <tbody>
                {stats.referralsMade.map((ref: any) => {
                  const createdAtDate = new Date(ref.createdAt);
                  const expiryDate = new Date(ref.createdAt);
                  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
                  const isExpired = expiryDate < new Date();
                  
                  return (
                    <tr key={ref.id} style={{ borderBottom: '1px solid #f8fafc', opacity: isExpired ? 0.6 : 1 }}>
                      <td style={{ padding: '1.5rem 0', paddingRight: '1rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           {ref.referee?.name || (locale === 'zh-TW' ? '匿名用戶' : 'Anonymous User')}
                           {!isExpired && <Sparkles size={14} color="#f59e0b" />}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.merchant.dashboard.wallet.joinedAt} {createdAtDate.toLocaleDateString()}</div>
                      </td>
                      <td style={{ padding: '1.5rem 0', paddingRight: '1rem', color: 'var(--accent-color)', fontWeight: 900 }}>
                        £{(ref.earnedFromReferee || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '1.5rem 0', paddingRight: '1rem' }}>
                        <div style={{ color: isExpired ? '#ef4444' : 'var(--text-primary)', fontWeight: 600 }}>
                           {expiryDate.toLocaleDateString()} {t.merchant.dashboard.wallet.validUntil}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 0' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.35rem 0.75rem', 
                          borderRadius: '99px',
                          backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                          color: isExpired ? '#ef4444' : '#facc15',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          border: isExpired ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid rgba(16, 185, 129, 0.1)'
                        }}>
                          {isExpired ? t.merchant.dashboard.wallet.expired : t.merchant.dashboard.wallet.active}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
