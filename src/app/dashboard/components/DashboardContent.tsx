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
  Home
} from "lucide-react";
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";
import { claimReferralCode } from "@/app/actions/referral";
import { useSession, signOut } from "next-auth/react";

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  CONFIRMED: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981' },
  PENDING:   { bg: 'rgba(245, 158, 11, 0.12)',  text: '#f59e0b' },
  COMPLETED: { bg: 'rgba(99, 102, 241, 0.12)',  text: '#6366f1' },
  CANCELLED: { bg: 'rgba(239, 68, 68, 0.12)',   text: '#ef4444' },
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
      backgroundColor: 'rgba(255,255,255,0.03)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--accent-color)', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
          {icon}
        </div>
        {trend && !loading && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>
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
        setClaimStatus({ type: 'success', message: '推薦碼兌換成功！' });
        // 🚀 Optimistic Update
        setData((prev: any) => ({
          ...prev,
          user: {
            ...prev.user,
            referredBy: '專家 (Processing...)'
          }
        }));
        refreshData(true);
      } else {
        setClaimStatus({ type: 'error', message: result.error || '兌換失敗' });
      }
    } catch (e) {
      setClaimStatus({ type: 'error', message: '發生錯誤，請稍後再試' });
    } finally {
      setClaiming(false);
    }
  };

  const refreshData = useCallback(async (isManual = false) => {
    if (isManual) setSyncing(true);
    setError(false);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      
      // 🚀 CRITICAL RECOVERY: If the session says we are logged in, but the DB says "User not found" (404/401),
      // it means we have a "Ghost Session". We MUST force a sign out to fix this loop.
      if (res.status === 401 || res.status === 404) {
        localStorage.removeItem('dashboard_data');
        await signOut({ callbackUrl: '/auth/login' });
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
            ? `⚠ ${t.merchant.dashboard.syncFailed}`
            : lastSync
              ? <>
                  <span style={{ color: '#10b981' }}>●</span> {t.merchant.dashboard.lastSynced}: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              title="推廣獎勵"
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
              title="推廣獎勵"
              value={`£${(user?.referralCredits || 0).toFixed(2)}`}
              icon={<Gift size={24} />}
              loading={loading && !data}
            />
          </>
        )}
      </div>

      {/* Referral Program Banner */}
      <section className="glass-panel animate-fade-up" style={{ 
        padding: '2rem', 
        borderRadius: '24px', 
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', flex: '1 1 400px', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '16px', color: '#10b981' }}>
            <Gift size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>{t.home.referralCTA.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
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
              <div style={{ color: '#10b981' }}><CheckCircle size={18} /></div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', opacity: 0.8 }}>已被推薦 Referred by</div>
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
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    width: '140px',
                    fontSize: '0.9rem'
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
                  {claiming ? <Loader2 size={14} className="spin" /> : '領取獎勵 Claim'}
                </button>
              </div>
              {claimStatus && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: claimStatus.type === 'success' ? '#10b981' : '#ef4444', 
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>快速存取我的資產</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <Link href="/dashboard/garage" style={{ textDecoration: 'none' }}>
              <div className="glass-panel" style={{ 
                padding: '1.5rem', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s, background 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                  <Car size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>我的車庫</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>管理車輛資訊及保養記錄</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/properties" style={{ textDecoration: 'none' }}>
              <div className="glass-panel" style={{ 
                padding: '1.5rem', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.2s, background 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#f59e0b' }}>
                  <Home size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>我的物業</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>查看物業細節及相關預約</p>
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
            查看全部 →
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
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                      {booking.service?.name || '服務'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {t.booking.labels.date}：{new Date(booking.scheduledDate).toLocaleString()}
                    </p>
                    {booking.vehicleReg && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                        車牌：{booking.vehicleMake} {booking.vehicleModel} · {booking.vehicleReg}
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
