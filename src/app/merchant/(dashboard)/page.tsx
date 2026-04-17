"use client";

import { useEffect, useState } from 'react';
import { 
  getMerchantDashboardStats, 
  getMerchantBookings, 
  updateMerchantAvatar,
  updateMerchantProfile,
  updateBookingMeetingLink,
  getAIPricingInsights
} from '@/app/actions/merchant_dashboard';
import { 
  proposeVariation, 
  getBookingVariations 
} from '@/app/actions/dispute_arbiter';
import { 
  Users, Briefcase, Star, Clock, 
  TrendingUp, Wallet, CheckCircle2, 
  AlertCircle, ChevronRight, MoreHorizontal,
  PlusCircle, Camera, X, Cpu, Loader2,
  Video, Link2, ExternalLink
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
  
  // Advanced Settings State
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [aiKnowledge, setAiKnowledge] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [trialPrice, setTrialPrice] = useState('');
  const [isTrialAvailable, setIsTrialAvailable] = useState(false);
  const [pricingHealth, setPricingHealth] = useState<any>(null);
  const [marketTrend, setMarketTrend] = useState<any>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editingMeetId, setEditingMeetId] = useState<string | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState('');

  const handleUpdateMeetLink = async (id: string) => {
    setUpdatingId(id);
    const res = await updateBookingMeetingLink(id, meetLinkInput);
    if (res.success) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, googleMeetLink: meetLinkInput } : b));
      setEditingMeetId(null);
    }
    setUpdatingId(null);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const s = await getMerchantDashboardStats();
        const b = await getMerchantBookings();
        const p = await getAIPricingInsights() as any;

        if (!s.error) {
          setStats(s);
          setYoutubeUrl(s.youtubeVideoUrl || '');
          setAiKnowledge(s.aiKnowledgeBase || '');
          setBaseRate(s.baseHourlyRate?.toString() || '');
          setTrialPrice(s.trialPrice?.toString() || '');
          setIsTrialAvailable(s.isTrialAvailable || false);
        }
        
        if (p && !p.error) {
          setPricingHealth(p.health);
          setMarketTrend(p.trend);
        }
        
        if (!b.error && b.bookings) {
          const enriched = await Promise.all((b.bookings as any[]).map(async (book: any) => {
            const res = await getBookingVariations(book.id);
            const vars = res.success ? res.variations : [];
            return { ...book, variations: vars };
          }));
          setBookings(enriched);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
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
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
      const newStats = await getMerchantDashboardStats();
      if (!newStats.error) setStats(newStats);
    }
    setUpdatingId(null);
  };

  const handleSaveAdvanced = async () => {
    setIsSavingProfile(true);
    const res = await updateMerchantProfile({
      youtubeVideoUrl: youtubeUrl,
      aiKnowledgeBase: aiKnowledge,
      baseHourlyRate: parseFloat(baseRate) || 0,
      trialPrice: parseFloat(trialPrice) || 0,
      isTrialAvailable: isTrialAvailable
    });
    if (res.success) {
      alert(t?.merchant?.settings?.saved || "Elite settings & Pricing calibrated successfully.");
      // Refresh insights if rate changed
      const p = await getAIPricingInsights() as any;
      if (p && !p.error) setPricingHealth(p.health);
    } else {
      alert(res.error || "Calibration failed.");
    }
    setIsSavingProfile(false);
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
             <img src={stats?.avatarUrl || "https://ui-avatars.com/api/?name=Merchant"} style={{ objectFit: 'cover', width: '100%', height: '100%' }} alt="Avatar" />
             <input title={t?.merchant?.avatar?.hint || "Update Avatar"} type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) return alert(t?.merchant?.avatar?.errorSize || "File too large");
                  const reader = new FileReader();
                  reader.onloadend = async () => {
                      const b64 = reader.result as string;
                      setStats((prev: any) => ({ ...prev, avatarUrl: b64 }));
                      await updateMerchantAvatar(b64);
                  };
                  reader.readAsDataURL(file);
                }
             }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
             <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'var(--accent-color)', color: 'var(--text-contrast)', fontSize: '0.65rem', fontWeight: 800, textAlign: 'center', padding: '2px 0', pointerEvents: 'none' }}>
                {t?.merchant?.avatar?.upload || "Upload"}
             </div>
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              ConciergeAI <span style={{ color: 'var(--accent-color)' }}>{t?.merchant?.expertTitle || "Expert"}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {t?.merchant?.welcome?.replace('{name}', stats?.companyName || "Member") || "Welcome back"}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <Link href="/services/results" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', color: 'var(--accent-color)', borderRadius: '12px', textDecoration: 'none' }}>{t?.merchant?.previewProfile || "Preview Profile"}</Link>
           <Link href="/merchant/services" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none', backgroundColor: 'var(--accent-color)', color: 'var(--text-contrast)', borderRadius: '12px', fontWeight: 700 }}>{t?.merchant?.manageServices || "Manage Services"}</Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title={t?.merchant?.stats?.totalBookings || "Total Bookings"} value={stats?.totalBookings || 0} icon={<Briefcase size={24} color="#d4af37" />} label={t?.merchant?.stats?.totalJobs || "Total Jobs"} />
        <StatCard title={t?.merchant?.stats?.rating || "Rating"} value={stats?.rating?.toFixed(1) || "5.0"} icon={<Star size={24} color="#d4af37" fill="#d4af37" />} label={`${stats?.reviews || 0} ${t?.merchant?.stats?.reviews || "Reviews"}`} />
        <StatCard title={t?.merchant?.stats?.pendingBalance || "Pending Balance"} value={`£${(stats?.pendingBalance || 0).toFixed(2)}`} icon={<Clock size={24} color="#d4af37" />} label={t?.merchant?.stats?.escrowHeld || "In Escrow"} />
        <StatCard title={t?.merchant?.stats?.availableBalance || "Available Balance"} value={`£${(stats?.availableBalance || 0).toFixed(2)}`} icon={<Wallet size={24} color="#d4af37" />} label={t?.merchant?.stats?.availableNow || "Available Now"} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <section style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t?.merchant?.bookings?.title || "Bookings"}</h2>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}>{t?.merchant?.bookings?.viewAll || "View All"}</Link>
          </div>

          {bookings.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.3 }}>
               <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
               <p>{t?.merchant?.bookings?.empty || "No missions found"}</p>
             </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {bookings.map((booking: any) => (
                  <div key={booking.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{booking.service?.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(booking.scheduledDate).toLocaleString()}</p>
                          <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>•</span>
                          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{booking.customer?.name}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <StatusBadge status={booking.status} t={t} />
                         <button 
                          onClick={() => { setSelectedBooking(booking); setShowVariationModal(true); }}
                          style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}>
                          <PlusCircle size={20} />
                         </button>
                      </div>
                    </div>

                    {/* 🎓 GOOGLE MEET INTEGRATION FOR EDUCATION */}
                    {booking.isEducation && (
                      <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed var(--gold-500)', borderRadius: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingMeetId === booking.id ? '1rem' : '0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Video size={18} color="var(--gold-500)" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-400)' }}>Google Meeting</span>
                          </div>
                          
                          {editingMeetId !== booking.id ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {booking.googleMeetLink && (
                                <a href={booking.googleMeetLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
                                  <ExternalLink size={16} />
                                </a>
                              )}
                              <button 
                                onClick={() => { setEditingMeetId(booking.id); setMeetLinkInput(booking.googleMeetLink || ''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                {booking.googleMeetLink ? "Edit Link" : "Set Meet Link"}
                              </button>
                            </div>
                          ) : null}
                        </div>

                        {editingMeetId === booking.id && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="text" 
                              value={meetLinkInput}
                              onChange={e => setMeetLinkInput(e.target.value)}
                              placeholder="https://meet.google.com/..."
                              style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--gold-500)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                            />
                            <button 
                              onClick={() => handleUpdateMeetLink(booking.id)}
                              className="hover-scale"
                              style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--gold-500)', color: '#000', border: 'none', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {updatingId === booking.id ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                            </button>
                            <button onClick={() => setEditingMeetId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}><X size={18} /></button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          )}
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>{t?.merchant?.quickLinks?.title || "Elite Actions"}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <QuickLink label={t?.merchant?.availabilityLink || "Set Availability"} />
                 <QuickLink label={t?.merchant?.servicePricing || "Service Pricing"} />
                 <QuickLink label={t?.merchant?.documentAudit || "Document Audit"} />
              </div>
           </div>

           {/* 🚀 NEW: Elite AI & Video Configuration */}
           <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--gold-500)', boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Cpu size={20} color="var(--gold-500)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--gold-400)' }}>Elite AI & Video</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Introduction Video (YouTube)</label>
                  <input 
                    type="text" 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AI Expert Knowledge Base</label>
                  <textarea 
                    value={aiKnowledge}
                    onChange={(e) => setAiKnowledge(e.target.value)}
                    placeholder="Paste your specialized knowledge, experience, and service nuances here to power your AI Assistant..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem', height: '120px', resize: 'none' }}
                  />
                </div>

                <button 
                  onClick={handleSaveAdvanced}
                  disabled={isSavingProfile}
                  style={{ 
                    width: '100%', padding: '0.85rem', borderRadius: '14px', 
                    background: 'linear-gradient(135deg, #d4af37, #f5e07a)', 
                    color: '#000', fontWeight: 900, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Update Profile</>}
                </button>
              </div>
           </div>

           {/* 💎 NEW: AI Pricing Intelligence Pulse */}
           <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: `1.5px solid ${pricingHealth?.color || 'var(--border-color)'}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <TrendingUp size={18} color={pricingHealth?.color} />
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: pricingHealth?.color }}>AI Pricing Pulse</h3>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', marginBottom: '1rem' }}>
                 <p style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Status: <span style={{ color: pricingHealth?.color }}>{pricingHealth?.status || 'OPTIMAL'}</span>
                 </p>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {pricingHealth?.message || 'Scanning market trends...'}
                 </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Market Trend ({stats?.businessType || 'GCSE'}):</span>
                 <span style={{ fontWeight: 800, color: '#10b981' }}>{marketTrend?.change || '+0.0%'}</span>
              </div>
           </div>

           {/* 💰 NEW: Pricing & Packages Control */}
           <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Pricing & Trial</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>BASE HOURLY RATE (£)</label>
                   <input 
                     type="number" 
                     value={baseRate} 
                     onChange={(e) => setBaseRate(e.target.value)}
                     style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} 
                   />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enable Trial (30m)</span>
                   <input 
                     type="checkbox" 
                     checked={isTrialAvailable} 
                     onChange={(e) => setIsTrialAvailable(e.target.checked)}
                     style={{ width: '20px', height: '20px', accentColor: 'var(--accent-color)' }}
                   />
                </div>

                {isTrialAvailable && (
                  <div className="animate-fade-in">
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>TRIAL PRICE (£)</label>
                    <input 
                      type="number" 
                      value={trialPrice} 
                      onChange={(e) => setTrialPrice(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-color)', fontWeight: 800 }} 
                    />
                  </div>
                )}

                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '0.5rem' }}>
                   * platform fee (9%) will be added to student total.
                </p>
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

function StatCard({ title, value, icon, label }: any) {
  return (
    <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ opacity: 0.1, position: 'absolute', right: '-10px', top: '-10px', transform: 'scale(2.5)' }}>{icon}</div>
      <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{icon}{title}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>{value}</p>
      <p style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>{label}</p>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: any }) {
  const styles: any = {
    PENDING: { bg: 'rgba(255, 165, 0, 0.1)', color: '#ffa500', label: t?.merchant?.status?.pending || "Pending" },
    CONFIRMED: { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', label: t?.merchant?.status?.confirmed || "Confirmed" },
    COMPLETED: { bg: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', label: t?.merchant?.status?.completed || "Completed" },
    CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: t?.merchant?.status?.cancelled || "Cancelled" },
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
    <button style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
      <ChevronRight size={16} />
    </button>
  );
}

function VariationModal({ isOpen, onClose, onSubmit, amount, setAmount, desc, setDesc, photo, setPhoto, loading, t }: any) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(12px)' }}>
       <div style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', borderRadius: '32px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{t?.merchant?.modal?.title || "Initialize Calibration"}</h3>
            <button onClick={onClose} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
          </div>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t?.merchant?.modal?.amount || "Amount"}</label>
              <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t?.merchant?.modal?.reason || "Reasoning"}</label>
              <textarea required value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: '#fff', height: '100px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t?.merchant?.modal?.photo || "Evidence URL"}</label>
              <input required type="text" value={photo} onChange={e => setPhoto(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: '#fff' }} />
            </div>
            <button disabled={loading} type="submit" style={{ padding: '1rem', backgroundColor: 'var(--accent-color)', color: '#000', borderRadius: '16px', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
              {loading ? "Transmitting..." : (t?.merchant?.modal?.submit || "Push Change")}
            </button>
          </form>
       </div>
    </div>
  );
}
