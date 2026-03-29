"use client";

import { useEffect, useState } from 'react';
import { 
  getMerchantDashboardStats, 
  getMerchantBookings, 
  updateBookingStatus 
} from '@/app/actions/merchant_dashboard';
import { 
  proposeVariation, 
  getBookingVariations 
} from '@/app/actions/dispute_arbiter';
import { 
  Users, Briefcase, Star, Clock, 
  TrendingUp, Wallet, CheckCircle2, 
  AlertCircle, ChevronRight, MoreHorizontal,
  PlusCircle, Camera, X, Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Variation Modal State
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [vAmount, setVAmount] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vPhoto, setVPhoto] = useState('');

  useEffect(() => {
    async function loadData() {
      const s = await getMerchantDashboardStats();
      const b = await getMerchantBookings();
      if (!s.error) setStats(s);
      
      // Fetch variations for each booking for a richer UI
      if (!b.error && b.bookings) {
        const enriched = await Promise.all((b.bookings as any[]).map(async (book: any) => {
          const res = await getBookingVariations(book.id);
          const vars = res.success ? res.variations : [];
          return { ...book, variations: vars };
        }));
        setBookings(enriched);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleProposeVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    
    setUpdatingId(selectedBooking.id);
    const formData = new FormData();
    formData.append('bookingId', selectedBooking.id);
    formData.append('amount', vAmount);
    formData.append('description', vDesc);
    formData.append('photoUrl', vPhoto || "https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?auto=format&fit=crop&q=80&w=400");
    
    const res = await proposeVariation(formData);

    if (res.success) {
      // Refresh local state
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, variations: [...(b.variations || []), res.variation] } : b));
      setShowVariationModal(false);
      setVAmount(''); setVDesc(''); setVPhoto('');
    }
    setUpdatingId(null);
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'PENDING') nextStatus = 'CONFIRMED';
    else if (currentStatus === 'CONFIRMED') nextStatus = 'COMPLETED';
    else return;

    setUpdatingId(id);
    const res = await updateBookingStatus(id, nextStatus);
    if (res.success) {
      // Refresh local state
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
      // Re-fetch stats to update wallet
      const newStats = await getMerchantDashboardStats();
      if (!newStats.error) setStats(newStats);
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #ccfbf1', borderTopColor: 'var(--accent-color)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            商戶中心 <span style={{ color: 'var(--accent-color)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>歡迎回來，{stats?.companyName || '合作夥伴'}。這是您今日的業務概況。</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <Link href="/services/results" className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>預覽商戶頁</Link>
           <Link href="/dashboard/merchant/services" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>管理服務</Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="總預約量" value={stats?.totalBookings} icon={<Briefcase size={24} />} color="#3b82f6" label="Total Jobs" />
        <StatCard title="服務評分" value={stats?.rating.toFixed(1)} icon={<Star size={24} color="#f59e0b" fill="#f59e0b" />} color="#f59e0b" label={`${stats?.reviews} 條評價`} />
        <StatCard title="待入賬金額" value={`£${stats?.pendingBalance.toFixed(2)}`} icon={<Clock size={24} />} color="#6366f1" label="Escrow Held" />
        <StatCard title="可提取餘額" value={`£${stats?.availableBalance.toFixed(2)}`} icon={<Wallet size={24} />} color="#10b981" label="Available Now" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Main Bookings List */}
        <section className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>最新訂單 Tracking</h2>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600 }}>查看全部</Link>
          </div>

          {bookings.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
               <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
               <p>暫時未有預約紀錄</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: '1.5rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-color)' }}>
                      {booking.customer?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{booking.service?.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        客戶: {booking.customer?.name} · {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {booking.status === 'COMPLETED' ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'flex-end' }}>
                         <CheckCircle2 size={16} /> 已完工
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => { setSelectedBooking(booking); setShowVariationModal(true); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
                          >
                             <PlusCircle size={14} style={{ marginRight: '0.3rem' }} /> 加價 Variation
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange(booking.id, booking.status)}
                          disabled={updatingId === booking.id}
                          className="btn btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minWidth: '100px' }}
                        >
                          {updatingId === booking.id ? '...' : booking.status === 'PENDING' ? '接單 Confirm' : '完工 Complete'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Variation Indicator */}
                  {booking.variations && booking.variations.length > 0 && (
                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {booking.variations.map((v: any) => (
                          <div key={v.id}>
                            <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                              <span>項目: {v.description}</span>
                              <span style={{ color: 'var(--accent-color)' }}>£{v.amount}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                狀態: {v.status === 'PENDING' ? '⏳ 審核中' : v.status === 'APPROVED' ? '✅ 已批准' : '⚠️ 被駁回/爭議'}
                              </span>
                              {v.status === 'DISPUTED' && (!booking.dispute || booking.dispute.status !== 'RESOLVED') && (
                                <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem' }}>AI 仲裁程序啟動中</span>
                              )}
                            </div>

                            {/* AI Reasoning for Merchant */}
                            {booking.dispute && booking.dispute.status === 'RESOLVED' && (
                              <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <Cpu size={14} /> AI 裁決理由 (Arbitration Reasoning):
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                                  {booking.dispute.aiReasoning}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar Tasks / Notifications */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp color="#16a34a" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>業績增長 Tips</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                您本週的預約量增長了 15%！上傳更多服務相片可以進一步提升轉化率。
              </p>
           </div>

           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>快速操作</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <QuickLink label="修改工作時段" />
                <QuickLink label="查看收入報告" />
                <QuickLink label="聯絡平台客服" />
              </div>
           </div>
        </aside>
      </div>
      
      <VariationModal 
        isOpen={showVariationModal}
        onClose={() => setShowVariationModal(false)}
        onSubmit={handleProposeVariation}
        booking={selectedBooking}
        amount={vAmount} setAmount={setVAmount}
        desc={vDesc} setDesc={setVDesc}
        photo={vPhoto} setPhoto={setVPhoto}
        loading={updatingId === selectedBooking?.id}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, label }: any) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'scale(3)' }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: { bg: '#fff7ed', color: '#9a3412', label: '待處理' },
    CONFIRMED: { bg: '#eff6ff', color: '#1e40af', label: '已接單' },
    COMPLETED: { bg: '#f0fdf4', color: '#166534', label: '已完成' },
    CANCELLED: { bg: '#fef2f2', color: '#991b1b', label: '已取消' },
  };
  const style = styles[status] || styles.PENDING;
  return (
    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', backgroundColor: style.bg, color: style.color, fontSize: '0.75rem', fontWeight: 800 }}>
      {style.label}
    </span>
  );
}

function QuickLink({ label }: { label: string }) {
  return (
    <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
      <ChevronRight size={16} color="var(--text-secondary)" />
    </button>
  );
}

// Variation Modal Component (Internal to this file for simplicity)
function VariationModal({ isOpen, onClose, onSubmit, booking, amount, setAmount, desc, setDesc, photo, setPhoto, loading }: any) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
       <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '24px', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>新增項目 Variation</h3>
            <button onClick={onClose} style={{ opacity: 0.5, cursor: 'pointer' }}><X /></button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>加價金額 Extra Amount (£)</label>
                <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 800 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>項目描述 Reason</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="點解要加錢？例如：零件更換..." style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: '80px', resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>證據相片 Photo Proof Link</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
                  <Camera size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>提示：清晰嘅相片可以加速 AI 審核流程。</p>
              </div>
              
              <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                {loading ? '提交中...' : '確認提交 Propose'}
              </button>
            </div>
          </form>
       </div>
    </div>
  );
}
