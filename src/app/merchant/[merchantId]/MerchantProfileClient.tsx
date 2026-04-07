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
  const isAccounting = merchant.services.some((s: any) => s.category === 'Accounting' || s.category === 'Tax');

  const firstServicePrice = merchant.services.length > 0 ? merchant.services[0].price : 0;
  
  // Default Portfolio for accountants if none provided
  const portfolio = isAccounting ? [
    "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=600", // Ledger/Tax
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600", // Consultation
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"  // Charts
  ] : [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400"
  ];

  const themeColor = 'var(--accent-color)';
  const themeBg = 'var(--bg-primary)';
  const cardBg = 'var(--glass-bg)';
  const borderCol = 'var(--border-color)';

  return (
    <div style={{ backgroundColor: themeBg, minHeight: '100vh', paddingBottom: '5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero Banner Area - Optimized for Experts */}
      <div style={{ 
        position: 'relative', 
        height: 'clamp(300px, 50vh, 420px)', 
        backgroundColor: 'var(--surface-3)', 
        backgroundImage: isAccounting 
          ? `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920')` 
          : `url('https://images.unsplash.com/photo-1581094288338-2314dddb3146?auto=format&fit=crop&q=80&w=1920')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        display: 'flex', 
        alignItems: 'flex-end' 
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)' 
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: 'clamp(1.5rem, 5vw, 3.5rem)', width: '100%' }}>
          <div className="animate-fade-up hero-content mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
             <div className="animate-float hero-avatar" style={{ 
               width: '140px', 
               height: '140px', 
               borderRadius: '24px', 
               backgroundColor: 'var(--surface-1)', 
               padding: '0.4rem', 
               boxShadow: 'var(--shadow-xl)', 
               flexShrink: 0,
               border: `2px solid ${themeColor}`
             }}>
               <img src={merchant.avatarUrl || "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=300&q=80"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} />
             </div>
             <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.75rem', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 950, letterSpacing: '-0.02em' }}>{merchant.companyName}</h1>
                    {merchant.isVerified && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.4rem', 
                          backgroundColor: 'var(--accent-soft)', 
                          color: 'var(--accent-color)', 
                          padding: '0.3rem 1rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.875rem', 
                          fontWeight: 800, 
                          border: `1px solid ${themeColor}`,
                          flexDirection: isRTL ? 'row-reverse' : 'row' 
                        }}>
                           <ShieldCheck size={16} /> {isAccounting ? 'Elite Firm' : t.merchant.verified}
                        </span>
                        {/* Specialized Professional Badges */}
                        {isAccounting && (
                           <>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border-color)' }}>HMRC MTD Partner</span>
                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--border-color)' }}>ACCA Regulated</span>
                           </>
                        )}
                      </div>
                    )}
                </div>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>
                  {isAccounting 
                    ? "Tailored for UK overseas residents and SMEs. Compliant filing for your business." 
                    : (merchant.description || "Service Provider")}
                </p>
                <div className="hero-stats" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 4vw, 2rem)', color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <Star size={18} fill="var(--accent-color)" color="var(--accent-color)" />
                     <strong style={{ color: 'var(--text-primary)' }}>{merchant.averageRating}</strong> ({merchant.totalReviews} {t.merchant.realReviews})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <MapPin size={18} color={themeColor} /> {merchant.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                     <CheckCircle2 size={18} color="#10b981" /> HMRC Compliant
                  </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container mobile-stack" style={{ 
        display: 'flex', 
        gap: '3rem', 
        marginTop: '4rem',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}>
        
        {/* Main Content */}
        <div style={{ order: isRTL ? 2 : 1 }}>
            {/* Highlights - Pearl Gold Styling */}
            {merchant.reviews.length > 0 && (
              <section style={{ 
                padding: '2rem', 
                backgroundColor: 'var(--accent-soft)', 
                borderRadius: '24px', 
                border: `1px solid ${themeColor}`, 
                position: 'relative', 
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.15 }}>
                  <Sparkles size={120} color={themeColor} />
                </div>
                <h3 style={{ 
                  fontSize: '1rem', 
                  color: themeColor, 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  flexDirection: isRTL ? 'row-reverse' : 'row' 
                }}>
                   <ShieldCheck size={20} /> {isAccounting ? 'TRUSTED ADVISOR HIGHLIGHTS' : t.merchant.pricingAnalysis}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                   {["Expert Filing", "Overseas Support", "MTD Approved", "Fixed Fees", "Quick Respond"].map((kw, i) => (
                     <span key={i} style={{ 
                       padding: '0.6rem 1.25rem', 
                       backgroundColor: 'var(--surface-1)', 
                       color: 'var(--accent-color)', 
                       borderRadius: '14px', 
                       fontSize: '0.9rem', 
                       fontWeight: 800, 
                       border: `1px solid var(--border-color)`, 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '0.5rem', 
                       flexDirection: isRTL ? 'row-reverse' : 'row' 
                     }}>
                        <Check size={14} color={themeColor} strokeWidth={4} /> {kw}
                     </span>
                   ))}
                </div>
              </section>
            )}

            {/* About Section */}
            <section style={{ padding: '2.5rem', borderRadius: '24px', backgroundColor: cardBg, border: `1px solid ${borderCol}`, marginTop: '3rem', textAlign: isRTL ? 'right' : 'left' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 <Briefcase color={themeColor} size={28} /> {isAccounting ? 'Professional Background' : t.merchant.background}
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {merchant.description || "We provide top-tier accounting and tax compliance services for UK-based small businesses and overseas landlords. Our team utilizes cloud accounting like Xero and QuickBooks to ensure your business remains compliant with HMRC's Making Tax Digital (MTD)."}
              </p>
            </section>

            {/* Service Grid - Package Selection */}
            <section id="booking" style={{ marginTop: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {isAccounting ? '專業服務方案' : t.merchant.viewServices}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>透明定價，專業保障。Transparent pricing for professional assurance.</p>
                </div>
                <div style={{ padding: '0.5rem 1rem', borderRadius: '99px', border: `1px solid ${themeColor}`, color: themeColor, fontSize: '0.8rem', fontWeight: 800 }}>
                  MTD COMPLIANT
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '2rem' }}>
                {(isAccounting ? [
                  { id: 'tax-1', name: 'Income Tax', price: '150', category: 'Accounting', description: 'Personal self-assessment and tax planning.' },
                  { id: 'acc-1', name: 'Annual Accounts', price: '450', category: 'Accounting', description: 'Preparation and filing of statutory accounts.' },
                  { id: 'vat-1', name: 'VAT Filing', price: '85', category: 'Accounting', description: 'Quarterly VAT returns under MTD regulations.' },
                  { id: 'pay-1', name: 'Payroll', price: '25', category: 'Accounting', description: 'Monthly payslips and HMRC reporting (per employee).' },
                  { id: 'xero-1', name: 'Xero Consult', price: '120', category: 'Accounting', description: 'Cloud accounting setup and training session.' },
                  { id: 'anal-1', name: 'Tax Analysis', price: '200', category: 'Accounting', description: 'In-depth review of business tax efficiency.' },
                ] : merchant.services).map((svc: any) => (
                  <div key={svc.id} className="glass-panel" style={{ 
                    padding: '2rem', 
                    borderRadius: '28px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    border: `1px solid ${borderCol}`, 
                    backgroundColor: cardBg, 
                    textAlign: isRTL ? 'right' : 'left',
                    transition: 'all 0.3s'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <h4 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>{svc.name}</h4>
                        <div style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 900, border: `1px solid ${themeColor}` }}>
                          {svc.category}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        {svc.description || "Professional service compliant with UK regulations."}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: `1px solid ${borderCol}`, paddingTop: '1.5rem', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                         <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{svc.price}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>起 Start</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: themeColor }}>
                           <ShieldCheck size={14} /> <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>SECURE</span>
                         </div>
                      </div>
                      <Link 
                        href={`/book/${currentMerchantId}?serviceId=${svc.id}&service=${encodeURIComponent(svc.name)}&price=£${svc.price}&category=${encodeURIComponent(svc.category)}`}
                        className="btn" 
                        style={{ 
                          width: '100%', 
                          background: 'var(--premium-gradient)', 
                          color: 'white', 
                          fontWeight: 900, 
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '1rem',
                          textDecoration: 'none'
                        }}
                      >
                         立即預約諮詢 <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

             {/* Portfolio section */}
            <section style={{ padding: '2.5rem', borderRadius: '24px', backgroundColor: cardBg, border: `1px solid ${borderCol}`, marginTop: '3rem', textAlign: isRTL ? 'right' : 'left' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 <Sparkles color={themeColor} size={28} /> {isAccounting ? 'Compliance Partners & Tools' : 'Portfolio'}
               </h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
                  {isAccounting ? (
                    ['Xero', 'Quickbooks', 'HMRC', 'ACCA', 'Freeagent'].map((p) => (
                      <div key={p} style={{ padding: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 900, fontSize: '0.9rem' }}>
                        {p}
                      </div>
                    ))
                  ) : (
                    (merchant.portfolioImages || portfolio).map((imgUrl: string, idx: number) => (
                      <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid var(--border-color)' }}>
                        <img src={imgUrl} alt="portfolio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))
                  )}
               </div>
            </section>

             {/* Reviews Section */}
             <section style={{ padding: '2.5rem', borderRadius: '24px', backgroundColor: cardBg, border: `1px solid ${borderCol}`, marginTop: '3rem', textAlign: isRTL ? 'right' : 'left' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 <MessageSquare color={themeColor} size={28} /> {t.merchant.reviewTitle}
               </h2>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                 {merchant.reviews.length === 0 ? (
                   <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                     <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                     <p>{t.merchant.noReviews}</p>
                   </div>
                 ) : (
                   merchant.reviews.map((rev: any) => (
                     <div key={rev.id} style={{ borderBottom: `1px solid var(--border-color)`, paddingBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                             {rev.customer?.name?.charAt(0) || "U"}
                           </div>
                           <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{rev.customer?.name || "User"}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                           </div>
                        </div>
                        <p style={{ marginTop: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.comment}</p>
                     </div>
                   ))
                 )}
               </div>
             </section>
        </div>

        {/* Sidebar - Sticky Card */}
        <div style={{ flex: '0 0 380px', maxWidth: '100%' }}>
           <div style={{ 
             position: 'sticky', 
             top: '100px', 
             padding: '2.5rem', 
             borderRadius: '32px', 
             backgroundColor: 'var(--glass-bg)', 
             border: `1px solid ${themeColor}`, 
             boxShadow: 'var(--shadow-xl)',
             textAlign: isRTL ? 'right' : 'left',
             backdropFilter: 'blur(32px) saturate(180%)'
           }}>
              <h3 style={{ fontSize: '0.8rem', color: themeColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
                {isAccounting ? 'OFFICIAL CHANNEL' : t.merchant.bookingChannel}
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 500 }}>
                {isAccounting 
                  ? "Book a professional consultation with our UK tax experts today. Fixed fee proposals provided after initial review." 
                  : t.merchant.guarantee}
              </p>
              <a href="#booking" className="btn" style={{ 
                width: '100%', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                background: 'var(--premium-gradient)', 
                color: 'white',
                fontWeight: 900, 
                textAlign: 'center', 
                textDecoration: 'none', 
                display: 'block', 
                fontSize: '1.1rem' 
              }}>
                 {isAccounting ? '立即聯繫事務所' : t.merchant.viewServices}
              </a>
              
              <div style={{ borderTop: `1px solid var(--border-color)`, marginTop: '3rem', paddingTop: '2rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                       <ShieldCheck size={24} color={themeColor} />
                       <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 800 }}>AML/KYC Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                       <Sparkles size={24} color={themeColor} />
                       <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 800 }}>Expert Consultation</span>
                    </div>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
