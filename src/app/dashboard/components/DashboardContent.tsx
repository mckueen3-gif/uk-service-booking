"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  Loader2,
  RefreshCw,
  Gift,
  Copy,
  Car,
  Home,
  ShieldCheck
} from "lucide-react";
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";
import { claimReferralCode } from "@/app/actions/referral";
import { useSession, signOut } from "next-auth/react";
import ShareProfile from '@/components/merchant/ShareProfile';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  CONFIRMED: { bg: 'rgba(212, 175, 55, 0.12)', text: '#d4af37' },
  PENDING:   { bg: 'rgba(245, 158, 11, 0.12)',  text: '#f59e0b' },
  COMPLETED: { bg: 'rgba(16, 185, 129, 0.1)',   text: '#059669' },
  CANCELLED: { bg: 'rgba(100, 116, 139, 0.1)',  text: '#64748b' },
};

const STATUS_LABEL = (t: any): Record<string, string> => ({
  CONFIRMED: t.merchant.dashboard.status.confirmed,
  PENDING:   t.merchant.dashboard.status.pending,
  COMPLETED: t.merchant.dashboard.status.completed,
  CANCELLED: t.merchant.dashboard.status.cancelled,
});

function StatCard({ icon, title, value, trend, loading }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  loading?: boolean;
}) {
  return (
    <div className="glass-panel animate-fade-up" style={{
      padding: '1.5rem',
      borderRadius: '20px',
      background: 'var(--soft-gradient)',
      border: '1px solid rgba(212, 175, 55, 0.25)',
      boxShadow: '0 8px 20px rgba(184, 134, 11, 0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
          {icon}
        </div>
        {trend && !loading && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#facc15', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
      {loading ? (
        <div className="skeleton-line" style={{ height: '2rem', width: '6rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
      ) : (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</h3>
      )}
    </div>
  );
}

export default function DashboardContent({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  // Referral claiming state
  const [claimCode, setClaimCode] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleClaimReferral = async () => {
    if (!claimCode.trim()) return;
    setClaiming(true);
    setClaimStatus(null);
    try {
      const result = await claimReferralCode(claimCode.trim());
      if (result.success) {
        setClaimStatus({ type: 'success', message: t.customer_dashboard.referral.success });
        // 🚀 Optimistic Update
        setData((prev: any) => ({
          ...prev,
          user: {
            ...prev.user,
            referredBy: t.merchant.dashboard.syncing
          }
        }));
        refreshData(true);
      } else {
        setClaimStatus({ type: 'error', message: result.error || t.customer_dashboard.referral.failed });
      }
    } catch (e) {
      setClaimStatus({ type: 'error', message: t.customer_dashboard.referral.error });
    } finally {
      setClaiming(false);
    }
  };

  const refreshData = useCallback(async (isManual = false) => {
    if (isManual) setSyncing(true);
    setError(false);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      
      // 🚀 CRITICAL RECOVERY: Clear ghost sessions via brutal redirect
      if (res.status === 401 || res.status === 404) {
        localStorage.removeItem('dashboard_data');
        await signOut({ redirect: false });
        window.location.href = '/auth/login?error=SessionExpired';
        return;
      }

      if (res.ok) {
        const newData = await res.json();
        if (newData?.user?.id === "error-fallback") {
          setError(true);
        } else {
          setData(newData);
          setLastSync(new Date());
          localStorage.setItem('dashboard_data', JSON.stringify(newData));
          
          if (newData?.user?.referralCode && 
              newData.user.referralCode !== "REF-PENDING" && 
              newData.user.referralCode !== "REF-SYNCING" &&
              newData.user.referralCode !== (session?.user as any)?.referralCode) {
             update({ referralCode: newData.user.referralCode });
          }
        }
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("Dashboard sync failed:", e);
      setError(true);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('dashboard_data');
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    refreshData();
    const interval = setInterval(() => refreshData(), 30_000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const { data: session, update } = useSession();
  const { user, isMerchant, merchantData, bookings } = data || {};
  const activeBookings = (bookings || []).filter((b: any) =>
    b.status === "PENDING" || b.status === "CONFIRMED"
  );

  return (
    <div className="animate-fade-up">
      {/* 🚀 NEW: Merchant Sharing Tool */}
      {isMerchant && merchantData && (
        <div style={{ marginBottom: '2.5rem' }}>
           <ShareProfile merchantId={merchantData.id} companyName={merchantData.companyName} />
        </div>
      )}

      {/* 🛡️ Verification Status Alert for Unverified Merchants */}
      {isMerchant && !merchantData?.isVerified && (
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem',
          borderRadius: '24px',
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '14px', color: '#ef4444' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.2rem', color: '#ef4444' }}>{t.customer_dashboard.verification.unverifiedTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {t.customer_dashboard.verification.unverifiedDesc}
              </p>
            </div>
          </div>
          <Link href="/merchant/verification" className="btn btn-primary" style={{ flexShrink: 0, padding: '0.75rem 1.5rem', fontWeight: 800 }}>
            {t.customer_dashboard.verification.cta}
          </Link>
        </div>
      )}

      {/* Live Sync Status Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {syncing && <Loader2 size={12} style={{ color: 'var(--accent-color)', animation: 'spin 1s linear infinite' }} />}
        <span style={{ fontSize: '0.75rem', color: error ? '#ef4444' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {error
            ? <>
                ⚠ {t.merchant.dashboard.syncFailed}
                <button onClick={() => { localStorage.clear(); window.location.href='/api/auth/signout'; }} style={{ marginLeft: '0.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>{t.common.exit}</button>
              </>
            : lastSync
              ? <>
                  <span style={{ color: '#facc15' }}>●</span> {t.merchant.dashboard.lastSynced}: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </>
              : `○ ${t.merchant.dashboard.syncing}`}
        </span>
        <button
          onClick={() => refreshData(true)}
          disabled={syncing}
          className="hover-scale"
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            background: 'var(--surface-1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={12} style={{ animation: syncing ? 'spin 1.5s linear infinite' : 'none' }} />
          {t.merchant.dashboard.refresh}
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {isMerchant ? (
          <>
            <StatCard
              title={t.merchant.dashboard.stats.availableBalance}
              value={`£${(merchantData?.wallet?.totalEarned || 0).toFixed(2)}`}
              icon={<Wallet size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title={t.merchant.dashboard.stats.pendingBalance}
              value={`£${(merchantData?.wallet?.pendingBalance || 0).toFixed(2)}`}
              icon={<Clock size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title={t.merchant.dashboard.status.completed}
              value={(bookings || []).filter((b: any) => b.status === "COMPLETED").length}
              icon={<CheckCircle size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title={t.customer_dashboard.stats.referralCredits}
              value={`£${(user?.referralCredits || 0).toFixed(2)}`}
              icon={<Gift size={24} />}
              loading={loading && !data}
            />
          </>
        ) : (
          <>
            <StatCard
              title={t.merchant.dashboard.bookings.title}
              value={activeBookings.length}
              icon={<Calendar size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title={t.merchant.dashboard.status.completed}
              value={(bookings || []).filter((b: any) => b.status === "COMPLETED").length}
              icon={<TrendingUp size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title={t.customer_dashboard.stats.referralCredits}
              value={`£${(user?.referralCredits || 0).toFixed(2)}`}
              icon={<Gift size={24} />}
              loading={loading && !data}
            />
          </>
        )}
      </div>

      {/* Referral Program Banner - VIP Invitation Control */}
      <section className="glass-panel animate-fade-up" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '3rem',
        background: 'var(--soft-gradient)',
        border: '1px dashed rgba(212, 175, 55, 0.6)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        boxShadow: '0 4px 20px rgba(184, 134, 11, 0.08)'
      }}>
        <div style={{ display: 'flex', flex: '1 1 400px', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '16px', color: '#d4af37' }}>
            <Gift size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{t.home.referralCTA.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {t.home.referralCTA.subtitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ paddingLeft: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{t.home.referralCTA.referralLabel}</div>
              <code style={{ fontSize: (user?.referralCode === "REF-PENDING" || !user?.referralCode) ? '0.75rem' : '1.2rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '1px', opacity: (user?.referralCode === "REF-PENDING" || !user?.referralCode) ? 0.5 : 1 }}>
                {(user?.referralCode === "REF-PENDING" || !user?.referralCode) ? "---" : user.referralCode}
              </code>
            </div>
            <button onClick={() => {
              if (user?.referralCode) {
                navigator.clipboard.writeText(user.referralCode);
                alert(t.common.copied);
              }
            }} className="btn btn-primary" style={{ padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem' }}>
              <Copy size={14} /> {t.common.copy}
            </button>
          </div>

          {user?.referredBy ? (
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: '#facc15' }}><CheckCircle size={18} /></div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#d4af37', opacity: 0.8 }}>{t.onboarding.questions?.referral || 'Referred by'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#064e3b' }}>{user.referredBy}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder={t.home.referralCTA.referralLabel} 
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                  disabled={claiming}
                  style={{ 
                    padding: '0.6rem 1rem', 
                    borderRadius: '10px', 
                    background: 'rgba(255,255,255,0.4)', 
                    border: '1px solid var(--border-color)',
                    color: '#1a1a1a',
                    width: '140px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }} 
                />
                <button 
                  onClick={handleClaimReferral}
                  disabled={claiming || !claimCode}
                  className="btn" 
                  style={{ 
                    padding: '0.6rem 1rem', 
                    borderRadius: '10px', 
                    background: 'var(--accent-color)', 
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {claiming ? <Loader2 size={14} className="spin" /> : t.customer_dashboard.referral.claim}
                </button>
              </div>
              {claimStatus && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: claimStatus.type === 'success' ? '#facc15' : '#ef4444', 
                  fontWeight: 600,
                  padding: '0 0.5rem'
                }}>
                  {claimStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 🚀 QUICK LINKS: For Customers Only */}
      {!isMerchant && (
        <section className="animate-fade-up" style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t.customer_dashboard.quickLinks.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <Link href="/dashboard/garage" style={{ textDecoration: 'none' }}>
              <div className="glass-panel hover-lift" style={{ 
                padding: '1.5rem', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                background: 'var(--soft-gradient)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 4px 12px rgba(184, 134, 11, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#d4af37' }}>
                  <Car size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{t.customer_dashboard.quickLinks.garage}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.customer_dashboard.quickLinks.garageDesc}</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/properties" style={{ textDecoration: 'none' }}>
              <div className="glass-panel hover-lift" style={{ 
                padding: '1.5rem', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                background: 'var(--soft-gradient)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 4px 12px rgba(184, 134, 11, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#f59e0b' }}>
                  <Home size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{t.customer_dashboard.quickLinks.properties}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.customer_dashboard.quickLinks.propertiesDesc}</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Recent Bookings */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.merchant.dashboard.bookings.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {t.merchant.dashboard.bookings.viewAll}
            </p>
          </div>
          <Link href="/dashboard/bookings" style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            {t.merchant.dashboard.bookings.viewAll} →
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {loading && !bookings ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{
                height: '5rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            ))
          ) : (bookings && bookings.length > 0) ? (
            bookings.slice(0, 5).map((booking: any) => {
              const sc = STATUS_COLOR[booking.status] || STATUS_COLOR.PENDING;
              return (
                <div key={booking.id} style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                   background: 'var(--soft-gradient)',
                  border: '1px solid rgba(184, 134, 11, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 12px rgba(184, 134, 11, 0.04)',
                  transition: 'all 0.2s'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                      {booking.service?.name || t.common.serviceFallback}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {t.booking?.labels?.date || 'Date'}: {new Date(booking.scheduledDate).toLocaleString()}
                    </p>
                    {booking.vehicleReg && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                        {t.common.licensePlate}: {booking.vehicleMake} {booking.vehicleModel} · {booking.vehicleReg}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, marginBottom: '0.4rem' }}>
                      £{(booking.totalAmount || 0).toFixed(2)}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      backgroundColor: sc.bg,
                      color: sc.text
                    }}>
                      {STATUS_LABEL(t)[booking.status] || booking.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ fontWeight: 600 }}>{t.merchant.dashboard.bookings.empty}</p>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
