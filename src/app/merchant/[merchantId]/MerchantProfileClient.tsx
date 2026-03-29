"use client";

import { 
  Star, MapPin, CheckCircle2, ShieldCheck, Clock, Check, 
  ArrowRight, MessageSquare, Briefcase, ThumbsUp, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/LanguageContext";
import AIPricingAnalysis from "@/components/AIPricingAnalysis";

interface MerchantProfileClientProps {
  merchant: any;
  currentMerchantId: string;
}

export default function MerchantProfileClient({ merchant, currentMerchantId }: MerchantProfileClientProps) {
  const { t, isRTL } = useTranslation();

  const firstServicePrice = merchant.services.length > 0 ? merchant.services[0].price : 0;
  const portfolio = [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400"
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', paddingBottom: '5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero Banner Area */}
      <div style={{ position: 'relative', height: '350px', backgroundColor: '#e2e8f0', backgroundImage: `url('https://images.unsplash.com/photo-1581094288338-2314dddb3146?auto=format&fit=crop&q=80&w=1920')`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '3rem', width: '100%' }}>
          <div className="animate-fade-up hero-content" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
             <div className="animate-float hero-avatar" style={{ width: '120px', height: '120px', borderRadius: '16px', backgroundColor: '#ffffff', padding: '0.4rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', flexShrink: 0 }}>
               <img src="https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=300&q=80" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
             </div>
             <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <h1 style={{ color: 'white', margin: 0, fontSize: '2.5rem', fontWeight: 900 }}>{merchant.companyName}</h1>
                    {merchant.isVerified && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#ccfbf1', color: '#0f766e', padding: '0.2rem 0.75rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 700, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <CheckCircle2 size={16} /> {t.merchant.verified}
                        </span>
                        {/* Specialized Professional Badges */}
                        {merchant.services.some((s: any) => s.category === 'Accounting') && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.2rem 0.75rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 800, border: '1px solid #fde68a' }}>
                             ACCA Regulated
                          </span>
                        )}
                      </div>
                    )}
                </div>
                <p style={{ fontSize: '1.25rem', color: '#e2e8f0', fontWeight: 500, marginBottom: '0.75rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {merchant.description || "Service Provider"}
                </p>
                <div className="hero-stats" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <Star size={16} fill="#f59e0b" color="#f59e0b" />
                     <strong style={{ color: '#ffffff' }}>{merchant.averageRating}</strong> ({merchant.totalReviews} {t.merchant.realReviews})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <MapPin size={16} /> {merchant.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <Clock size={16} /> Integrity
                  </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: isRTL ? '350px 1fr' : '1fr 350px', gap: '2.5rem', marginTop: '3rem' }}>
        
        {/* Main Content */}
        <div style={{ order: isRTL ? 2 : 1 }}>
            {/* Highlights */}
            {merchant.reviews.length > 0 && (
              <section style={{ padding: '1.5rem', backgroundColor: 'var(--accent-soft)', borderRadius: '18px', border: '1px solid var(--accent-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Sparkles size={80} color="var(--accent-color)" /></div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                   <ShieldCheck size={16} /> {t.merchant.pricingAnalysis}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', position: 'relative', zIndex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                   {Array.from(new Set(merchant.reviews.flatMap((r: any) => r.keywords?.split(',') || []))).slice(0, 6).map((kw: any, i) => (
                     <span key={i} style={{ padding: '0.5rem 1rem', backgroundColor: '#ffffff', color: 'var(--accent-color)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, border: '1px solid var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <CheckCircle2 size={12} /> {kw.trim()}
                     </span>
                   ))}
                </div>
              </section>
            )}

           {/* About Section */}
           <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', marginTop: '2.5rem', textAlign: isRTL ? 'right' : 'left' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 <Briefcase color="var(--accent-color)" /> {t.merchant.background}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {merchant.description || "Expert provider."}
              </p>
           </section>

           <AIPricingAnalysis 
             merchantName={merchant.companyName} 
             merchantPrice={firstServicePrice} 
             location={merchant.city} 
           />

           {/* Service Grid */}
           <section id="booking" style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: isRTL ? 'right' : 'left' }}>{t.merchant.viewServices}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {merchant.services.map((svc: any) => (
                  <div key={svc.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-1)', textAlign: isRTL ? 'right' : 'left' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{svc.name}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 700, backgroundColor: 'var(--accent-soft)', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>
                          {svc.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        {svc.description || "High quality service."}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                         <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>£{svc.price}</span>
                            {svc.description?.includes('Per Month') && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/月 month</span>}
                         </div>
                         <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>{t.merchant.guarantee}</span>
                      </div>
                      <Link 
                        href={`/book/${currentMerchantId}?serviceId=${svc.id}&service=${encodeURIComponent(svc.name)}&price=£${svc.price}&category=${encodeURIComponent(svc.category)}`}
                        className="btn btn-primary" 
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '10px', fontSize: '0.95rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}
                      >
                         {t.booking.buttons.next} <ArrowRight size={18} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', marginTop: '3rem', textAlign: isRTL ? 'right' : 'left' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <MessageSquare color="var(--accent-color)" size={28} /> {t.merchant.reviewTitle}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {merchant.reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', fontSize: '1.1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '24px' }}>
                    <MessageSquare size={60} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                    <p style={{ fontWeight: 600 }}>{t.merchant.noReviews}</p>
                  </div>
                ) : merchant.reviews.map((rev: any) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', border: '1px solid var(--border-color)' }}>
                          {rev.customer?.name?.charAt(0) || "U"}
                        </div>
                        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                           <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.15rem' }}>{rev.customer?.name || "User"}</div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                              <span style={{ color: 'var(--border-color)' }}>|</span>
                              <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                 <Check size={14} strokeWidth={3} /> {t.merchant.verifiedBooking}
                              </span>
                           </div>
                        </div>
                     </div>
                      <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-primary)', marginTop: '1.75rem', fontWeight: 500 }}>
                        {rev.comment}
                      </p>
                      
                      {rev.reply && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem 1.75rem', backgroundColor: 'var(--accent-soft)', borderRadius: '20px', borderLeft: isRTL ? 'none' : '5px solid var(--accent-color)', borderRight: isRTL ? '5px solid var(--accent-color)' : 'none', position: 'relative' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 900, marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.05em', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <MessageSquare size={16} /> {t.merchant.reply}
                          </div>
                          <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 600 }}>{rev.reply}</p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </section>
        </div>

        {/* Sidebar */}
        <div style={{ order: isRTL ? 1 : 2 }}>
           <div style={{ position: 'sticky', top: '100px', padding: '2.5rem', borderRadius: '28px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', boxShadow: '0 25px 30px -10px rgba(0,0,0,0.08)', textAlign: isRTL ? 'right' : 'left' }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.75rem' }}>{t.merchant.bookingChannel}</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.25rem', fontWeight: 500 }}>
                {t.merchant.guarantee}
              </p>
              <a href="#booking" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'block', fontSize: '1.1rem' }}>
                 {t.merchant.viewServices}
              </a>
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', paddingTop: '2rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                       <ShieldCheck size={20} color="#10b981" />
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{t.merchant.guarantee}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                       <Clock size={20} color="#10b981" />
                       <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{t.merchant.fastResponse}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
