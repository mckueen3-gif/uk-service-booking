"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  MessageSquare,
  Loader2,
  RefreshCw,
  Users,
  Gift,
  Copy,
  Car,
  Home
} from "lucide-react";
import Link from 'next/link';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  CONFIRMED: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981' },
  PENDING:   { bg: 'rgba(245, 158, 11, 0.12)',  text: '#f59e0b' },
  COMPLETED: { bg: 'rgba(99, 102, 241, 0.12)',  text: '#6366f1' },
  CANCELLED: { bg: 'rgba(239, 68, 68, 0.12)',   text: '#ef4444' },
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: '已確認',
  PENDING:   '等待中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

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
  const [data, setData] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const refreshData = useCallback(async (isManual = false) => {
    if (isManual) setSyncing(true);
    setError(false);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
        setLastSync(new Date());
        localStorage.setItem('dashboard_data', JSON.stringify(newData));
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
    // STEP 1: Load from cache instantly
    const cached = localStorage.getItem('dashboard_data');
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Cache parse error", e);
      }
    }

    // STEP 2: Fetch fresh data immediately
    refreshData();

    // STEP 3: Poll every 30 seconds for real-time updates
    const interval = setInterval(() => refreshData(), 30_000);
    return () => clearInterval(interval);
  }, [refreshData]);

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
        {syncing && <Loader2 size={14} style={{ color: 'var(--accent-color)', animation: 'spin 1s linear infinite' }} />}
        <span style={{ fontSize: '0.78rem', color: error ? '#ef4444' : '#10b981', fontWeight: 500 }}>
          {error
            ? '⚠ 數據同步失敗'
            : lastSync
              ? `● 已即時同步 ${lastSync.toLocaleTimeString('zh-HK')}`
              : '○ 正在連線...'}
        </span>
        <button
          onClick={() => refreshData(true)}
          disabled={syncing}
          title="立即刷新"
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <RefreshCw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          刷新
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {isMerchant ? (
          <>
            <StatCard
              title="總收入"
              value={`£${(merchantData?.wallet?.totalEarned || 0).toFixed(2)}`}
              icon={<Wallet size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title="待結算款項"
              value={`£${(merchantData?.wallet?.pendingBalance || 0).toFixed(2)}`}
              icon={<Clock size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title="已完成訂單"
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
              title="進行中預約"
              value={activeBookings.length}
              icon={<Calendar size={24} />}
              loading={loading && !data}
            />
            <StatCard
              title="已完成服務"
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

      {/* 🚀 NEW: Referral Program Banner */}
      <section className="glass-panel animate-fade-up" style={{ 
        padding: '2rem', 
        borderRadius: '24px', 
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '16px', color: '#10b981' }}>
            <Users size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>邀請好友，賺取獎勵</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              分享您的專屬推廣碼，每成功推薦一位好友即可獲得獎勵。
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          padding: '0.5rem', 
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.1)',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <code style={{ 
            fontSize: '1.25rem', 
            fontWeight: 900, 
            letterSpacing: '2px',
            color: 'var(--accent-color)',
            padding: '0 0.5rem'
          }}>
            {user?.referralCode || '-------'}
          </code>
          <button 
            onClick={() => {
              if (user?.referralCode) {
                navigator.clipboard.writeText(user.referralCode);
                alert('推廣碼已複製！');
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Copy size={14} />
            複製
          </button>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>近期預約狀態</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              每30秒自動更新 · 即時顯示
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
                      預約日期：{new Date(booking.scheduledDate).toLocaleString('zh-HK')}
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
                      {STATUS_LABEL[booking.status] || booking.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Calendar size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ fontWeight: 600 }}>目前沒有預約記錄</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                您的預約紀錄將在這裡即時顯示
              </p>
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
