"use client";

import { useEffect, useState } from 'react';
import { 
  getMerchantDashboardStats, 
  getMerchantBookings, 
  updateBookingStatus,
  updateMerchantAvatar
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

import { useTranslation } from '@/components/LanguageContext';

export default function MerchantDashboard() {
  const { t } = useTranslation();
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--accent-soft)', borderTopColor: 'var(--accent-color)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--surface-1)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }} className="hover-scale">
             <img src={stats?.avatarUrl || "https://ui-avatars.com/api/?name=Merchant"} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
             <input title={t.merchant.dashboard.avatar.hint} type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) return alert(t.merchant.dashboard.avatar.errorSize);
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                     const b64 = reader.result as string;
                     setStats((prev: any) => ({ ...prev, avatarUrl: b64 }));
                     await updateMerchantAvatar(b64);
                     alert(t.merchant.dashboard.avatar.success);
                  };
                  reader.readAsDataURL(file);
                }
             }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
             <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'var(--accent-color)', color: 'var(--text-contrast)', fontSize: '0.65rem', fontWeight: 800, textAlign: 'center', padding: '2px 0', pointerEvents: 'none' }}>
               {t.merchant.dashboard.avatar.upload}
             </div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              ConciergeAI <span style={{ color: 'var(--accent-color)' }}>{t.merchant.dashboard.expertTitle}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t.merchant.dashboard.welcome.replace('{name}', stats?.companyName || t.common.user)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <Link href="/services/results" className="btn" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', color: 'var(--accent-color)', borderRadius: '12px', textDecoration: 'none' }}>{t.merchant.dashboard.previewProfile}</Link>
           <Link href="/dashboard/merchant/services" className="btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none', backgroundColor: 'var(--accent-color)', color: 'var(--text-contrast)', borderRadius: '12px', fontWeight: 700 }}>{t.merchant.dashboard.manageServices}</Link>
        </div>
      </header>

      {/* Stats Grid - Obsidian Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title={t.merchant.dashboard.stats.totalBookings} value={stats?.totalBookings} icon={<Briefcase size={24} color="#d4af37" />} color="#d4af37" label={t.merchant.dashboard.stats.totalJobs} />
        <StatCard title={t.merchant.dashboard.stats.rating} value={stats?.rating.toFixed(1)} icon={<Star size={24} color="#d4af37" fill="#d4af37" />} color="#d4af37" label={`${stats?.reviews} ${t.merchant.dashboard.stats.reviews}`} />
        <StatCard title={t.merchant.dashboard.stats.pendingBalance} value={`£${stats?.pendingBalance.toFixed(2)}`} icon={<Clock size={24} color="#d4af37" />} color="#d4af37" label={t.merchant.dashboard.stats.escrowHeld} />
        <StatCard title={t.merchant.dashboard.stats.availableBalance} value={`£${stats?.availableBalance.toFixed(2)}`} icon={<Wallet size={24} color="#d4af37" />} color="#d4af37" label={t.merchant.dashboard.stats.availableNow} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Main Bookings List - Dark Mode Glass */}
        <section style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t.merchant.dashboard.bookings.title}</h2>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600 }}>{t.merchant.dashboard.bookings.viewAll}</Link>
          </div>

          {bookings.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.3 }}>
               <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
               <p>{t.merchant.dashboard.bookings.empty}</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-color)' }}>
                      {booking.customer?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{booking.service?.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {t.booking.labels.merchant}: {booking.customer?.name} · {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <StatusBadge status={booking.status} t={t} />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {booking.status === 'COMPLETED' ? (
                      <span style={{ color: '#d4af37', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'flex-end' }}>
                         <CheckCircle2 size={16} /> {t.merchant.dashboard.bookings.completed}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => { setSelectedBooking(booking); setShowVariationModal(true); }}
                            className="btn"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid #d4af37', color: '#d4af37', borderRadius: '8px', backgroundColor: 'transparent' }}
                          >
                             <PlusCircle size={14} style={{ marginRight: '0.3rem' }} /> {t.merchant.dashboard.bookings.actions.variation}
                          </button>
                        )}
                        {booking.status === 'CONFIRMED' && !booking.isEducation && booking.stripeBalanceIntentId && (
                          <div style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 800, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d4af37', animation: 'pulse 2s infinite' }} />
                            {t.merchant.dashboard.balanceHeld}
                          </div>
                        )}
                        <button 
                          onClick={() => handleStatusChange(booking.id, booking.status)}
                          disabled={updatingId === booking.id}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minWidth: '120px', backgroundColor: '#d4af37', color: '#000', borderRadius: '10px', border: 'none', fontWeight: 700 }}
                        >
                          {updatingId === booking.id 
                            ? '...' 
                            : booking.status === 'PENDING' 
                              ? t.merchant.dashboard.bookings.actions.confirm 
                              : booking.isEducation 
                                ? t.merchant.dashboard.bookings.actions.complete 
                                : t.merchant.dashboard.bookings.actions.completeAndPay
                          }
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Variation Indicator - Obsidian Accent */}
                  {booking.variations && booking.variations.length > 0 && (
                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '12px', borderLeft: '4px solid #d4af37' }}>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {booking.variations.map((v: any) => (
                          <div key={v.id}>
                            <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                              <span>{t.merchant.dashboard.variations.label}: {v.description}</span>
                              <span style={{ color: '#d4af37' }}>£{v.amount}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                {t.merchant.dashboard.variations.status}: {v.status === 'PENDING' ? t.merchant.dashboard.variations.pending : v.status === 'APPROVED' ? t.merchant.dashboard.variations.approved : t.merchant.dashboard.variations.rejected}
                              </span>
                              {v.status === 'DISPUTED' && (!booking.dispute || booking.dispute.status !== 'RESOLVED') && (
                                <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem' }}>{t.merchant.dashboard.arbiterActive}</span>
                              )}
                            </div>

                            {/* AI Reasoning for Merchant */}
                            {booking.dispute && booking.dispute.status === 'RESOLVED' && (
                              <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <Cpu size={14} /> {t.merchant.dashboard.aiReason}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#ccc', lineHeight: 1.4 }}>
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

        {/* Sidebar - Obsidian Tips */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp color="#d4af37" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#d4af37' }}>{t.merchant.dashboard.tipsTitle}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5 }}>
                {t.merchant.dashboard.tips.growth}. {t.merchant.dashboard.tipsExtra}
              </p>
           </div>

           <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', color: '#fff' }}>{t.merchant.dashboard.quickLinks.title}</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <QuickLink label={t.merchant.dashboard.quickLinks.schedule} />
                <QuickLink label={t.merchant.dashboard.quickLinks.earnings} />
                <QuickLink label={t.merchant.dashboard.quickLinks.support} />
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
        t={t}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, label }: any) {
  return (
    <div style={{ padding: '1.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, transform: 'scale(3)', color: '#d4af37' }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#999', fontSize: '0.9rem', fontWeight: 600 }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem', color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: any }) {
  const styles: any = {
    PENDING: { bg: 'rgba(255, 165, 0, 0.1)', color: '#ffa500', label: t.merchant.dashboard.status.pending },
    CONFIRMED: { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', label: t.merchant.dashboard.status.confirmed },
    COMPLETED: { bg: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', label: t.merchant.dashboard.status.completed },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: t.merchant.dashboard.status.cancelled },
  };
  const style = styles[status] || styles.PENDING;
  return (
    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', backgroundColor: style.bg, color: style.color, fontSize: '0.75rem', fontWeight: 800, border: `1px solid ${style.color}33` }}>
      {style.label}
    </span>
  );
}

function QuickLink({ label }: { label: string }) {
  return (
    <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem', border: '1px solid #222', borderRadius: '12px', backgroundColor: '#111', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#222'}
    >
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
      <ChevronRight size={16} color="#444" />
    </button>
  );
}

function VariationModal({ isOpen, onClose, onSubmit, booking, amount, setAmount, desc, setDesc, photo, setPhoto, loading, t }: any) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease-out' }}>
       <div style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', borderRadius: '32px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
                <PlusCircle size={24} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{t.merchant.dashboard.modal.title}</h3>
            </div>
            <button onClick={onClose} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#444'}><X size={24} /></button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#050505', padding: '1.25rem', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.merchant.dashboard.modal.amount}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '1rem', fontSize: '1.2rem', fontWeight: 900, color: '#d4af37' }}>£</span>
                  <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.5rem', borderRadius: '12px', border: '1px solid #222', backgroundColor: '#000', color: '#fff', fontSize: '1.5rem', fontWeight: 900, outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#999', paddingLeft: '0.5rem' }}>{t.merchant.dashboard.modal.reason}</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder={t.merchant.dashboard.modal.reasonPlaceholder} style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #222', backgroundColor: '#050505', color: '#fff', height: '100px', resize: 'none', fontSize: '0.95rem', lineHeight: 1.5, outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#999', paddingLeft: '0.5rem' }}>
                  {t.merchant.dashboard.modal.photo} <span style={{ color: '#d4af37', fontSize: '0.7rem' }}>(ELITE REQUIREMENT)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input required type="text" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 3rem', borderRadius: '14px', border: '1px solid #222', backgroundColor: '#050505', color: '#fff', fontSize: '0.85rem' }} />
                  <Camera size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#d4af37', opacity: 0.6 }} />
                </div>
              </div>
              
              <button disabled={loading} type="submit" style={{ 
                width: '100%', 
                padding: '1.1rem', 
                marginTop: '1rem', 
                backgroundColor: '#d4af37', 
                color: '#000', 
                borderRadius: '16px', 
                border: 'none', 
                fontWeight: 900, 
                fontSize: '1rem', 
                cursor: 'pointer', 
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }} className="hover-lift">
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="animate-spin" style={{ width: '1.2rem', height: '1.2rem', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                    {t.merchant.dashboard.submitting}
                  </div>
                ) : t.merchant.dashboard.modal.submit}
              </button>
            </div>
          </form>
       </div>
    </div>
  );
}
