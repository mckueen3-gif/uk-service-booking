"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Wallet, TrendingUp, History, Landmark, Info, CheckCircle2, Clock, Sparkles, Loader2 } from "lucide-react";
import { getEarningsStats } from "@/app/actions/finance";
import BankForm from "./BankForm";
import WithdrawForm from "./WithdrawForm";
import { useTranslation } from "@/components/LanguageContext";

export default function MerchantWalletPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const stats = await getEarningsStats() as any;
      setData(stats);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
        <Loader2 className="animate-spin" size={48} color="#d4af37" />
      </div>
    );
  }

  const { wallet, recentWithdrawals, merchant, user, referralCount, error } = data || {};

  if (error || !merchant) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#991b1b' }}>
          ERROR
        </h1>
        <p style={{ color: '#b91c1c' }}>{error || "Initialization failed."}</p>
      </div>
    );
  }

  // Standard Commission Rate
  const currentRate = 9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: '#050505', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>
          {(t?.merchant?.merchant_wallet?.title || "Wallet & Earnings").split('&')[0]} & <span style={{ color: '#d4af37' }}>{(t?.merchant?.merchant_wallet?.title || "Wallet & Earnings").split('&')[1] || "Earnings"}</span>
        </h1>
        <p style={{ color: '#999', fontSize: '1.1rem' }}>{t?.merchant?.merchant_wallet?.subtitle || "Manage your specialist assets"}</p>
      </div>

      {/* Expert Referral Hub - New Feature Injection */}
      <div className="animate-fade-up delay-75" style={{ 
        padding: '1.5rem 2rem', 
        borderRadius: '24px', 
        background: 'rgba(212, 175, 55, 0.05)', 
        border: '1px dashed rgba(212, 175, 55, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '-1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#111', padding: '0.75rem', borderRadius: '12px', border: '1px solid #d4af37' }}>
            <Sparkles size={20} color="#d4af37" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: 0 }}>{t?.merchant?.merchant_wallet?.referral?.title || "Expert Referral"}</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{t?.merchant?.merchant_wallet?.referral?.subtitle || "Scale the network and earn yield."}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#000', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '12px', 
            border: '1px solid #222',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: 900,
            color: '#d4af37',
            letterSpacing: '2px'
          }}>
            {(session?.user as any)?.referralCode || "GETTING-CODE..."}
          </div>
          <button 
            onClick={() => {
              const code = (session?.user as any)?.referralCode;
              if (code) navigator.clipboard.writeText(code);
              alert(t?.merchant?.merchant_wallet?.referral?.copied || "Copied!");
            }}
            style={{ 
              backgroundColor: '#d4af37', 
              color: '#000', 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '12px', 
              fontWeight: 900, 
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {t?.merchant?.merchant_wallet?.referral?.copy || "Copy"}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Available Balance Card - Black Gold Texture */}
        <div className="animate-fade-up delay-100" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px', 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #d4af37',
          boxShadow: '0 10px 40px rgba(212, 175, 55, 0.15)'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, color: '#d4af37' }}>
            <Wallet size={180} />
          </div>
          <div style={{ marginBottom: '1.5rem', opacity: 0.6, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', color: '#d4af37' }}>{(t?.merchant?.merchant_wallet?.available || "Available").toUpperCase()}</div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, marginRight: '0.4rem', color: '#d4af37' }}>£</span>
            <span style={{ fontSize: '4.5rem', fontWeight: 900 }}>{wallet?.availableBalance?.toFixed(2) || "0.00"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#d4af37' }}>
            <CheckCircle2 size={16} /> {t?.merchant?.merchant_wallet?.postFee || "Net available after platform fee"}
          </div>
        </div>
    
        {/* Pending & Authorized Cards - Obsidian Glass */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
          {/* Pending Card */}
          <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', border: '1px solid #d4af37' }}>
               <Clock size={28} color="#d4af37" />
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '0.75rem', color: '#555', fontWeight: 800, letterSpacing: '0.05em' }}>{t?.merchant?.merchant_wallet?.asset_status?.pending || "PENDING / COOLING-OFF"}</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>£{wallet?.pendingBalance?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>{t?.merchant?.merchant_wallet?.asset_status?.settling || "Settling Assets"}</div>
             </div>
          </div>
          {/* Authorized Card */}
          <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', border: '1px solid #333' }}>
               <Landmark size={28} color="#d4af37" />
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '0.75rem', color: '#555', fontWeight: 800, letterSpacing: '0.05em' }}>{t?.merchant?.merchant_wallet?.asset_status?.authorized || "AUTHORIZED / HELD"}</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>£{wallet?.authorizedBalance?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>{t?.merchant?.merchant_wallet?.asset_status?.escrowed || "Escrowed for Repairs"}</div>
             </div>
          </div>
        </div>

        {/* 🚀 NEW: 5-Year Passive Yield Card */}
        <div className="animate-fade-up delay-150" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px', 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #000 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #d4af37',
          boxShadow: '0 10px 40px rgba(212, 175, 55, 0.1)'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, color: '#d4af37' }}>
            <Sparkles size={180} />
          </div>
          <div style={{ marginBottom: '1.5rem', opacity: 0.6, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', color: '#d4af37' }}>
            {(t?.merchant?.referral_passive?.passive_title || "5-Year Passive Yield").toUpperCase()}
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, marginRight: '0.4rem', color: '#d4af37' }}>£</span>
            <span style={{ fontSize: '4.5rem', fontWeight: 900 }}>{user?.referralCredits?.toFixed(2) || "0.00"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#d4af37' }}>
            <TrendingUp size={16} /> {t?.merchant?.referral_passive?.passive_dividend?.replace('{rate}', '2%')?.replace('{count}', referralCount || 0) || `2% Passive Dividends from ${referralCount || 0} Experts`}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Withdrawal & Bank */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '2rem', borderRadius: '28px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Landmark size={24} color="#d4af37" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>{t?.merchant?.merchant_wallet?.banking?.title || "Banking Details"}</h2>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <BankForm initialSortCode={merchant.bankSortCode} initialAccountNumber={merchant.bankAccountNumber} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '2rem 0' }} />

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '1.25rem' }}>{t?.merchant?.merchant_wallet?.payout?.title || "Payout Request"}</h3>
              <WithdrawForm availableBalance={wallet?.availableBalance || 0} />
            </div>
          </div>

          {/* Fee & Payment Terms Transparency - Premium Branding */}
          <div style={{ padding: '2rem', borderRadius: '28px', backgroundColor: '#0c0c0c', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <TrendingUp size={22} color="#d4af37" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{t?.merchant?.merchant_wallet?.terms?.yield_title || "Yield & Premium Terms"}</h2>
                </div>
                <div style={{ padding: '0.5rem 1rem', backgroundColor: '#d4af37', color: '#000', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900 }}>
                  FEE: {currentRate}%
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: '#050505', padding: '1.5rem', borderRadius: '20px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', color: '#d4af37' }}>
                    <Info size={16} />
                    <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t?.merchant?.merchant_wallet?.terms?.rights || "Expert Rights"}</span>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: '#999', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6 }}>
                    {(t?.merchant?.merchant_wallet?.terms?.rules || ["Secure Escrow Protocol", "T+7 Settlement Cycle"]).map((rule: string, idx: number) => (
                      <li key={idx}>
                        {rule.includes(':') ? (
                          <>
                            <b style={{ color: '#fff' }}>{rule.split(':')[0]}</b>: {rule.split(':')[1]}
                          </>
                        ) : rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: '#050505', padding: '1.25rem', borderRadius: '16px', border: '1px solid #1a1a1a', opacity: 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                    <History size={16} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{t?.merchant?.merchant_wallet?.terms?.customer_title || "Standard Customer Terms"}</span>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#555', paddingLeft: '1.2rem', margin: 0 }}>
                    <li>{t?.merchant?.merchant_wallet?.terms?.cooling_off || "14-day cooling-off period for academic services."}</li>
                    <li>{t?.merchant?.merchant_wallet?.terms?.deposit_rule || "20% non-refundable deposit for repair/technical work."}</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Right: History - Obsidian Table */}
        <div style={{ padding: '2.5rem', borderRadius: '32px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <History size={24} color="#d4af37" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>{t?.merchant?.merchant_wallet?.history?.title || "Asset History"}</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>{t?.merchant?.merchant_wallet?.history?.date || "Initiated"}</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>{t?.merchant?.merchant_wallet?.history?.amount || "Amount"}</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>{t?.merchant?.merchant_wallet?.history?.status || "Audit Status"}</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '4rem', textAlign: 'center', color: '#444', fontSize: '1rem', fontWeight: 600 }}>{t?.merchant?.merchant_wallet?.history?.empty || "No verified transactions found"}</td>
                  </tr>
                ) : (
                  recentWithdrawals.map((req: any) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', color: '#999' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1.5rem 0', fontWeight: 900, color: '#fff', fontSize: '1.25rem' }}>£{req.amount.toFixed(2)}</td>
                      <td style={{ padding: '1.5rem 0' }}>
                        <span style={{ 
                          backgroundColor: req.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                          color: req.status === 'PENDING' ? '#f59e0b' : '#d4af37', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '10px', 
                          fontSize: '0.75rem', 
                          fontWeight: 900,
                          border: `1px solid ${req.status === 'PENDING' ? '#f59e0b' : '#d4af37'}`
                        }}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
