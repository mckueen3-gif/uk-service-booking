"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, MapPin, Clock, Search, Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, Car } from "lucide-react";

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  CONFIRMED: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  PENDING:   { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  COMPLETED: { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
  CANCELLED: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: '已確認',
  PENDING:   '等待確認',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  CONFIRMED: <CheckCircle size={14} />,
  PENDING:   <Clock size={14} />,
  COMPLETED: <CheckCircle size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function BookingsContent() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  const syncBookings = useCallback(async (isManual = false) => {
    if (isManual) setSyncing(true);
    try {
      const res = await fetch('/api/bookings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const bks = data.bookings || [];
        setBookings(bks);
        setLastSync(new Date());
        localStorage.setItem('bookings_data', JSON.stringify(bks));
      }
    } catch (e) {
      console.error("Bookings sync failed", e);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    // 1. Load from cache instantly
    const cached = localStorage.getItem('bookings_data');
    if (cached) {
      try {
        setBookings(JSON.parse(cached));
        setLoading(false);
      } catch (e) { /* ignore */ }
    }

    // 2. Fetch fresh immediately
    syncBookings();

    // 3. Real-time polling every 30 seconds
    const interval = setInterval(() => syncBookings(), 30_000);
    return () => clearInterval(interval);
  }, [syncBookings]);

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (b.service?.name || "").toLowerCase().includes(s) ||
      (b.merchant?.companyName || "").toLowerCase().includes(s) ||
      (b.vehicleReg || "").toLowerCase().includes(s) ||
      b.id.toLowerCase().includes(s)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="搜尋服務、車牌、商家..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {syncing && <Loader2 size={14} style={{ color: 'var(--accent-color)', animation: 'spin 1s linear infinite' }} />}
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 500 }}>
            {lastSync ? `● 即時同步 ${lastSync.toLocaleTimeString('zh-HK')}` : '○ 連線中...'}
          </span>
          <button
            onClick={() => syncBookings(true)}
            disabled={syncing}
            style={{
              padding: '0.4rem 0.8rem',
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
            <RefreshCw size={12} />
            刷新
          </button>
        </div>
      </div>

      {/* Booking count */}
      {!loading && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.5rem' }}>
          共 <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> 筆預約紀錄
          {search && `（搜尋：「${search}」）`}
        </p>
      )}

      {/* Loading Skeleton */}
      {loading && bookings.length === 0 ? (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '10rem',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.04)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center', borderRadius: '32px' }}>
          <Calendar size={56} style={{ margin: '0 auto 1.5rem', opacity: 0.15, color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {search ? '找不到符合的預約' : '尚無預約紀錄'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {search ? `請嘗試其他搜尋關鍵字` : '您的所有服務預約將在此即時顯示'}
          </p>
          {!search && (
            <a href="/find" className="btn btn-primary" style={{ padding: '0.875rem 2rem', borderRadius: '16px', display: 'inline-block', textDecoration: 'none' }}>
              立即找服務
            </a>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((booking: any) => {
            const sc = STATUS_COLOR[booking.status] || STATUS_COLOR.PENDING;
            const scheduledDate = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
            const isUpcoming = scheduledDate && scheduledDate > new Date();
            return (
              <div
                key={booking.id}
                className="glass-panel animate-fade-up"
                style={{
                  padding: '1.75rem',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                      padding: '0.3rem 0.8rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {STATUS_ICON[booking.status]}
                    {STATUS_LABEL[booking.status] || booking.status}
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    #{booking.id.slice(-8).toUpperCase()}
                  </span>
                </div>

                {/* Service & Merchant */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    {booking.service?.name || '服務'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {booking.merchant?.companyName || '服務提供商'}
                  </p>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {scheduledDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={16} color="var(--accent-color)" />
                      <span style={{ fontWeight: isUpcoming ? 600 : 400, color: isUpcoming ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {scheduledDate.toLocaleString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {isUpcoming && <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>即將到來</span>}
                      </span>
                    </div>
                  )}
                  {(booking.vehicleReg || booking.vehicleMake) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <Car size={16} color="var(--accent-color)" />
                      <span>
                        {[booking.vehicleMake, booking.vehicleModel, booking.vehicleReg].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payment Progress & Status Details */}
                <div style={{ 
                  marginTop: '0.25rem', 
                  padding: '1rem', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {/* Sector Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>PAYMENT TRACKER</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: booking.isEducation ? 'rgba(168, 85, 247, 0.1)' : 'rgba(56, 189, 248, 0.1)', color: booking.isEducation ? '#a855f7' : '#0ea5e9' }}>
                      {booking.isEducation ? 'EDUCATION' : 'REPAIR'}
                    </span>
                  </div>

                  {/* Logical States */}
                  {booking.isEducation ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                        <CheckCircle size={14} /> 100% 已付清 Full Payment Secure
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        <Clock size={12} /> 14天冷靜期保障中 (至 {new Date(booking.coolingOffUntil).toLocaleDateString()} 止)
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {/* Step 1: Deposit */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                        <CheckCircle size={14} /> 20% 訂金已收 (£{(booking.depositPaid || 0).toFixed(2)})
                      </div>
                      
                      {/* Step 2: Balance Hold or Failure */}
                      {booking.status === 'CONFIRMED' && booking.stripeBalanceIntentId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 700 }}>
                          <CheckCircle size={14} /> 80% 尾款已成功鎖定 (£{(booking.balanceAmount || 0).toFixed(2)})
                        </div>
                      ) : booking.reauthDeadline && !booking.stripeBalanceIntentId && booking.status !== 'CANCELLED' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 800, padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <AlertCircle size={14} /> 餘額鎖定失敗！請在 {new Date(booking.reauthDeadline).toLocaleDateString()} 前更新卡片
                        </div>
                      ) : booking.status === 'COMPLETED' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                          <CheckCircle size={14} /> 100% 已完成結算 (£{(booking.totalAmount || 0).toFixed(2)})
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.85rem', opacity: 0.6 }}>
                          <Clock size={14} /> 尾款 80% 將於服務前 7 天自動鎖定
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{
                  marginTop: 'auto',
                  padding: '0.875rem 1.25rem',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>總額估計 Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    £{(booking.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
