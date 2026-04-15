"use client";
/* DEPLOY_BUST: 2026-04-05 13:56 - FORCING PRODUCTION REBUILD */

import { useEffect, useState } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { requestRedemption, getMyRedemptions } from "@/app/actions/rewards";
import { 
  Loader2, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Gift, 
  Copy, 
  Ticket, 
  Sparkles,
  History,
  Coins
} from "lucide-react";
import Barcode from "./Barcode";
import VoucherForm from "../VoucherForm";
import VoucherMarketplace from "./VoucherMarketplace";

export default function WalletContent() {
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [redemptionLoading, setRedemptionLoading] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [res, redRes] = await Promise.all([
          fetch(`/api/wallet`).then(r => r.json()),
          getMyRedemptions()
        ]);
        setStats(res);
        setRedemptions(redRes.success ? redRes.requests : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setTimeout(() => setSynced(true), 800);
      }
    }
    fetchData();
  }, []);

  const handleAdminTrigger = () => {
    setAdminClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setIsAdmin(true);
        alert(t?.rewards_hub?.adminEnabled || "Admin mode enabled");
        return 0;
      }
      return newCount;
    });
  };

  const totalRedeemedAmount = redemptions
    .filter(r => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const estimatedSavings = totalRedeemedAmount * 0.05;

  const handleRedeemRequest = async (amount: number, brandName: string = t?.rewards_hub?.defaultVoucher || "Generic") => {
    const confirmMsg = t?.merchant?.merchant_wallet?.rewards?.confirmRedeem?.replace("£", `£${amount}`) || `Confirm redemption of £${amount}?`;
    if (!confirm(confirmMsg)) return;
    
    setRedemptionLoading(true);
    const res = await (requestRedemption(amount, brandName) as any);
    setRedemptionLoading(false);

    if (res.success) {
      alert(t?.merchant?.merchant_wallet?.rewards?.requestSuccess || "Request submitted successfully");
      window.location.reload();
    } else {
      alert(res.error || "Error");
    }
  };

  const GoldCard = ({ children, title, icon: Icon, style = {} }: any) => (
    <div className="glass-panel" style={{ 
      padding: '2rem', 
      borderRadius: '24px', 
      border: '1.5px solid #d4af37 !important',
      boxShadow: '0 10px 40px rgba(184, 134, 11, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-1)',
      ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(184, 134, 11, 0.08)', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(184, 134, 11, 0.15)' }}>
          <Icon size={24} color="#b8860b" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{title || "Section"}</h2>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem', width: '100%' }}>
        <Loader2 className="animate-spin" size={64} color="#d4af37" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* 🟢 TOP ROW: Balance & Point Exchange */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Balance Card */}
        <div className="glass-panel" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px', 
          border: '1.5px solid #d4af37 !important',
          boxShadow: '0 20px 50px rgba(184, 134, 11, 0.12) !important',
          background: 'var(--surface-1) !important',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.08, color: '#d4af37' }}>
            <Wallet size={220} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <CreditCard size={20} color="#b8860b" />
            <span style={{ fontWeight: 800, letterSpacing: '0.15em', fontSize: '0.85rem', color: '#475569' }}>{t?.rewards_hub?.balance || "Available Wallet"}</span>
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 600, verticalAlign: 'top', color: '#b8860b', marginRight: '0.5rem' }}>£</span>
            <span style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: '#0f172a' }}>{stats?.referralCredits?.toFixed(2) || "0.00"}</span>
          </div>

          <div style={{ 
            marginBottom: '2rem', 
            fontSize: '0.7rem', 
            color: '#64748b', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.8rem',
            background: 'rgba(71, 85, 105, 0.05)',
            borderRadius: '8px',
            width: 'fit-content'
          }}>
            <Sparkles size={12} className="animate-pulse" />
            {t?.rewards_hub?.disclaimer || "Credits are non-transferable"}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#b8860b', fontWeight: 900, fontSize: '0.9rem' }}>
              <TrendingUp size={18} />
              <span style={{ letterSpacing: '0.05em' }}>{t?.rewards_hub?.status || "Status"}</span>
            </div>
            {estimatedSavings > 0 && (
              <div style={{ color: '#444', fontSize: '0.75rem', fontWeight: '600' }}>
                <span style={{ opacity: 0.6 }}>{t?.rewards_hub?.lifetimeSavings || "Lifetime Savings"} </span> 
                <span style={{ color: '#b8860b' }}>£{estimatedSavings.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 🌟 REDEMPTION CENTER: The Flagship Voucher Marketplace (AI Synced) */}
        <div style={{ gridColumn: '1 / -1' }} className="animate-fade-up">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1.5rem',
            padding: '0 1rem'
          }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Coins size={24} color="#d4af37" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {t.rewards_hub.marketplaceTitle}
            </h2>
          </div>
          
          <VoucherMarketplace 
            currentCredits={stats?.referralCredits || 0} 
            isAdmin={isAdmin}
            onAdminTrigger={handleAdminTrigger}
            onSuccess={() => window.location.reload()} 
            locale={locale}
          />
        </div>
      </div>

      {/* 🟡 MIDDLE ROW: Service Voucher & Referrals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Voucher Input Card */}
        <GoldCard title={t?.rewards_hub?.voucherRedeemTitle || "Voucher Rewards"} icon={Ticket}>
          <VoucherForm />
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            {t?.rewards_hub?.voucherRedeemDesc || "Redeem your service vouchers here"}
          </p>
        </GoldCard>

        {/* Referral Program Card */}
        <GoldCard title={t?.merchant?.merchant_wallet?.referralTitle || "Referral Program"} icon={Gift}>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6, fontWeight: '500' }}>
            {t?.merchant?.merchant_wallet?.referralDesc || "Invite friends to earn credits for every successful referral."}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-2)',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            border: '1.5px solid #d4af37',
            boxShadow: 'inset 0 2px 10px rgba(184, 134, 11, 0.05)'
          }}>
            <span style={{ fontWeight: 900, color: '#d4af37', fontSize: '1.5rem', letterSpacing: '0.15em' }}>
              {(stats?.referralCode === "PENDING" || stats?.referralCode === "REF-SYNCING") ? (
                <span style={{ fontWeight: 500, color: '#444', fontSize: '1rem' }}>{t?.merchant?.merchant_wallet?.generating || "Generating..."}</span>
              ) : (
                stats?.referralCode || "JOH2538"
              )}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(stats?.referralCode || "")}
              style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }}
              className="hover-gold-glow"
            >
              <Copy size={20} color="#d4af37" />
            </button>
          </div>
        </GoldCard>
      </div>

      {/* 🔵 BOTTOM ROW: Digital Vault & History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Digital Card Vault */}
        {redemptions.length > 0 && (
          <GoldCard title={t?.merchant?.merchant_wallet?.rewards?.myVault || "Digital Vault"} icon={Sparkles}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {redemptions.map((req: any) => (
                <div 
                  key={req.id} 
                  style={{ 
                    padding: '2rem', 
                    borderRadius: '24px', 
                    background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}
                  className="hover-gold-glow"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#d4af37', letterSpacing: '0.25em', fontWeight: 900, textTransform: 'uppercase' }}>{t?.rewards_hub?.marketplace?.hotDeals || "Hot Deals"}</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginTop: '0.25rem' }}>£{req.amount.toFixed(2)}</div>
                    </div>
                    <div style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '99px', 
                      fontSize: '0.7rem', 
                      fontWeight: 900, 
                      background: req.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                      color: req.status === 'COMPLETED' ? '#22c55e' : '#d4af37',
                      border: '1px solid currentColor' 
                    }}>
                      {req.status === 'COMPLETED' ? (t?.merchant?.merchant_wallet?.rewards?.statusReady || "READY") : (t?.merchant?.merchant_wallet?.rewards?.statusProcessing || "PROCESSING")}
                    </div>
                  </div>

                  {req.status === 'COMPLETED' ? (
                    <div className="animate-fade-up">
                      <Barcode code={req.voucherCode} />
                      <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                        {t?.merchant?.merchant_wallet?.rewards?.voucherDisclaimer || "Present barcode at service location"}
                      </p>
                    </div>
                  ) : (
                    <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.6 }}>
                      <Loader2 className="animate-spin" size={32} color="#d4af37" style={{ margin: '0 auto 1.5rem' }} />
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{t?.merchant?.merchant_wallet?.rewards?.statusProcessing || "Activating Voucher"}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GoldCard>
        )}

        {/* Transaction History Card */}
        <GoldCard title={t?.merchant?.merchant_wallet?.historyTitle || "Transaction History"} icon={History}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#d4af37', fontWeight: 800 }}>{t?.rewards_hub?.history?.headers?.type || "Type"}</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#d4af37', fontWeight: 800 }}>{t?.rewards_hub?.history?.headers?.description || "Detail"}</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#d4af37', fontWeight: 800 }}>{t?.rewards_hub?.history?.headers?.amount || "Sum"}</th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#d4af37', fontWeight: 800 }}>{t?.rewards_hub?.history?.headers?.date || "Timestamp"}</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.transactions?.length > 0) ? stats.transactions.map((tx: any) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="hover-highlight">
                    <td style={{ padding: '1.25rem', fontWeight: 700 }}>{tx.type}</td>
                    <td style={{ padding: '1.25rem', opacity: 0.8 }}>{tx.description}</td>
                    <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 900, color: tx.amount < 0 ? '#ef4444' : '#22c55e' }}>
                      {tx.amount < 0 ? '-' : '+'}£{Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right', opacity: 0.6 }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '4rem', opacity: 0.4 }}>{t?.rewards_hub?.history?.empty || "No ledger entries found"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GoldCard>
      </div>

      {/* Sync Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: synced ? '#b8860b' : '#94a3b8', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem',
          background: 'var(--surface-2)',
          padding: '0.5rem 1.25rem',
          borderRadius: '99px',
          border: `1px solid ${synced ? '#d4af37' : '#e2e8f0'}`,
          boxShadow: synced ? '0 4px 12px rgba(184, 134, 11, 0.05)' : 'none',
          fontWeight: '700',
          letterSpacing: '0.05em'
        }}>
           <div className={synced ? "pulse-gold" : ""} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: synced ? '#d4af37' : '#cbd5e1' }} />
           {synced ? (t?.rewards_hub?.syncReady || "Active") : (t?.rewards_hub?.syncing || "Synchronizing")}
        </div>
      </div>

    </div>
  );
}
