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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #ccfbf1', borderTopColor: 'var(--accent-color)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1200px' }}>
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
             <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.65rem', fontWeight: 800, textAlign: 'center', padding: '2px 0', pointerEvents: 'none' }}>
               {t.merchant.dashboard.avatar.upload}
             </div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              {t.merchant.dashboard.title} <span style={{ color: 'var(--accent-color)' }}>Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t.merchant.dashboard.welcome.replace('{name}', stats?.companyName || 'Partner')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <Link href="/services/results" className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>{t.merchant.dashboard.previewProfile}</Link>
           <Link href="/dashboard/merchant/services" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>{t.merchant.dashboard.manageServices}</Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title={t.merchant.dashboard.stats.totalBookings} value={stats?.totalBookings} icon={<Briefcase size={24} />} color="#3b82f6" label={t.merchant.dashboard.stats.totalJobs} />
        <StatCard title={t.merchant.dashboard.stats.rating} value={stats?.rating.toFixed(1)} icon={<Star size={24} color="#f59e0b" fill="#f59e0b" />} color="#f59e0b" label={`${stats?.reviews} ${t.merchant.dashboard.stats.reviews}`} />
        <StatCard title={t.merchant.dashboard.stats.pendingBalance} value={`£${stats?.pendingBalance.toFixed(2)}`} icon={<Clock size={24} />} color="#6366f1" label={t.merchant.dashboard.stats.escrowHeld} />
        <StatCard title={t.merchant.dashboard.stats.availableBalance} value={`£${stats?.availableBalance.toFixed(2)}`} icon={<Wallet size={24} />} color="#10b981" label={t.merchant.dashboard.stats.availableNow} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Main Bookings List */}
        <section className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.merchant.dashboard.bookings.title}</h2>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600 }}>{t.merchant.dashboard.bookings.viewAll}</Link>
          </div>

          {bookings.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
               <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
               <p>{t.merchant.dashboard.bookings.empty}</p>
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
                        {t.booking.labels.merchant}: {booking.customer?.name} · {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <StatusBadge status={booking.status} t={t} />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {booking.status === 'COMPLETED' ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'flex-end' }}>
                         <CheckCircle2 size={16} /> {t.merchant.dashboard.bookings.completed}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {booking.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => { setSelectedBooking(booking); setShowVariationModal(true); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
                          >
                             <PlusCircle size={14} style={{ marginRight: '0.3rem' }} /> {t.merchant.dashboard.bookings.actions.variation}
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange(booking.id, booking.status)}
                          disabled={updatingId === booking.id}
                          className="btn btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minWidth: '100px' }}
                        >
                          {updatingId === booking.id ? '...' : booking.status === 'PENDING' ? t.merchant.dashboard.bookings.actions.confirm : t.merchant.dashboard.bookings.actions.complete}
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
                              <span>{t.merchant.dashboard.variations.label}: {v.description}</span>
                              <span style={{ color: 'var(--accent-color)' }}>£{v.amount}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                {t.merchant.dashboard.variations.status}: {v.status === 'PENDING' ? t.merchant.dashboard.variations.pending : v.status === 'APPROVED' ? t.merchant.dashboard.variations.approved : t.merchant.dashboard.variations.rejected}
                              </span>
                              {v.status === 'DISPUTED' && (!booking.dispute || booking.dispute.status !== 'RESOLVED') && (
                                <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem' }}>{t.merchant.dashboard.variations.arbiterActive}</span>
                              )}
                            </div>

                            {/* AI Reasoning for Merchant */}
                            {booking.dispute && booking.dispute.status === 'RESOLVED' && (
                              <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <Cpu size={14} /> {t.merchant.dashboard.arbiterReasoning}
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
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>{t.merchant.dashboard.tips.title}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5 }}>
                {t.merchant.dashboard.tips.growth}
              </p>
           </div>

           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>{t.merchant.dashboard.quickLinks.title}</h3>
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

function StatusBadge({ status, t }: { status: string; t: any }) {
  const styles: any = {
    PENDING: { bg: '#fff7ed', color: '#9a3412', label: t.merchant.dashboard.status.pending },
    CONFIRMED: { bg: '#eff6ff', color: '#1e40af', label: t.merchant.dashboard.status.confirmed },
    COMPLETED: { bg: '#f0fdf4', color: '#166534', label: t.merchant.dashboard.status.completed },
    CANCELLED: { bg: '#fef2f2', color: '#991b1b', label: t.merchant.dashboard.status.cancelled },
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
function VariationModal({ isOpen, onClose, onSubmit, booking, amount, setAmount, desc, setDesc, photo, setPhoto, loading, t }: any) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
       <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '24px', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.merchant.dashboard.modal.title}</h3>
            <button onClick={onClose} style={{ opacity: 0.5, cursor: 'pointer' }}><X /></button>
          </div>
          
          <form onSubmit={onSubmit}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t.merchant.dashboard.modal.amount}</label>
                <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 800 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t.merchant.dashboard.modal.reason}</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder={t.merchant.dashboard.modal.reasonPlaceholder} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: '80px', resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t.merchant.dashboard.modal.photo}</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
                  <Camera size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', opacity: 0.5 }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{t.merchant.dashboard.modal.photoHint}</p>
              </div>
              
              <button disabled={loading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                {loading ? t.merchant.dashboard.modal.submitting : t.merchant.dashboard.modal.submit}
              </button>
            </div>
          </form>
       </div>
    </div>
  );
}
