"use client";

import { useState, useEffect } from 'react';
import { 
  Search, Wrench, PenTool, Droplets, Sparkles, Briefcase, GraduationCap, Scale, Calculator,
  ChevronRight, ChevronLeft, Star, CheckCircle2, MapPin, Navigation, Car, Loader2, ShieldCheck,
  Users, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import SearchHero from '@/components/search/SearchHero';
import RecommendationEngine from '@/components/discovery/RecommendationEngine';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import { searchMerchants } from '@/app/actions/search';
import { ALL_UK } from '@/components/LocationContext';
import { Copy, Check } from 'lucide-react';

export default function HomeClient() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t, locale, isRTL } = useTranslation();
  const { city } = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralCode = (session?.user as any)?.referralCode;

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getIcons = () => [
    { id: 'plumbing', label: t?.home?.categories?.plumbing || "Plumbing", icon: <Droplets size={28} strokeWidth={1.5} />, category: 'Plumbing' },
    { id: 'repairs', label: t?.home?.categories?.repairs || "Repairs", icon: <Wrench size={28} strokeWidth={1.5} />, category: 'Repairs' },
    { id: 'renovation', label: t?.home?.categories?.renovation || "Renovation", icon: <PenTool size={28} strokeWidth={1.5} />, category: 'Renovation' },
    { id: 'education', label: t?.home?.categories?.education || "Education", icon: <GraduationCap size={28} strokeWidth={1.5} />, category: 'Education' },
    { id: 'accounting', label: t?.home?.categories?.accounting || "Accounting", icon: <Calculator size={28} strokeWidth={1.5} />, category: 'Accounting' },
    { id: 'legal', label: t?.home?.categories?.legal || "Legal", icon: <Scale size={28} strokeWidth={1.5} />, category: 'Legal' },
    { id: 'commercial', label: t?.home?.categories?.commercial || "Commercial", icon: <Briefcase size={28} strokeWidth={1.5} />, category: 'Commercial' },
    { id: 'cleaning', label: t?.home?.categories?.cleaning || "Cleaning", icon: <Sparkles size={28} strokeWidth={1.5} />, category: 'Cleaning' },
  ];

  useEffect(() => {
    async function fetchLocalMerchants() {
      setLoading(true);
      try {
        const selectedCategory = getIcons().find(i => i.id === activeTab)?.category;
        const results = await searchMerchants({
          location: city === ALL_UK ? undefined : city,
          category: activeTab === 'all' ? undefined : selectedCategory,
          sortBy: 'rating'
        });
        setMerchants(results.slice(0, 8)); // Show top 8
      } catch (error) {
        console.error('Merchant Search Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLocalMerchants();
  }, [city, activeTab, locale]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [merchants, loading]);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      
      <div className="reveal">
        <SearchHero />
      </div>

      <div className="container reveal stagger-1" style={{ maxWidth: '1000px', marginTop: '-4rem', position: 'relative', zIndex: 5 }}>
        <RecommendationEngine />
      </div>

      {/* Social Proof / Trusted By Section */}
      <section className="reveal stagger-2" style={{ padding: '3rem 0', background: 'var(--surface-2)', marginTop: '4rem', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2.5rem' }}>
            {t?.home?.trustedBy || "Trusted by Authorities"}
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 'clamp(2rem, 8vw, 6rem)', 
            flexWrap: 'wrap',
            opacity: 0.6,
            filter: 'grayscale(100%)'
          }}>
            {['Trustpilot', 'Checkatrade', 'HMRC Approved', 'Stripe Secure', 'Gas Safe'].map(brand => (
              <span key={brand} style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* AI Instant Diagnosis CTA - PROMINENT POSITION */}
      <section className="container reveal stagger-1" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
        <div className="glass-panel mobile-stack" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(1.5rem, 5vw, 3rem)', 
          padding: 'clamp(2rem, 6vw, 4rem)',
          background: 'var(--soft-gradient)',
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid var(--gold-600)',
          boxShadow: '0 20px 40px -10px rgba(212, 175, 55, 0.2)'
        }}>
          {/* Decorative Background Element */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, var(--amber-100) 0%, transparent 70%)', opacity: 0.6 }}></div>

          <div style={{ flex: '1 1 500px', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--amber-600)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }}>
              <Sparkles size={16} /> {t?.home?.aiCTA?.badge || "Alpha System"}
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {t?.home?.aiCTA?.title1 || "Instant AI"} <br />
              <span style={{ color: 'var(--amber-600)' }}>{t?.[`home`]?.aiCTA?.title2 || "Diagnostics"}</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500, maxWidth: '600px' }}>
              {t?.home?.aiCTA?.subtitle || "Analyze complex service vectors with mesh intelligence."}
            </p>
            <Link href="/diagnosis" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ padding: '1.5rem 3.5rem', fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--amber-600), var(--amber-800))' }}>
                {t?.home?.aiCTA?.button || "Start Diagnostic"} <ChevronRight size={22} style={{ marginLeft: '0.5rem' }} />
              </button>
            </Link>
          </div>
          
          <div style={{ flex: '1 1 400px', height: '450px', zIndex: 1, borderRadius: '2.5rem', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)', transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)' }}>
             <img src="/images/ai-diagnosis-hero.png" alt="AI Diagnosis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* NEW: How It Works Section */}
      <section className="container reveal stagger-2" style={{ maxWidth: '1200px', marginTop: '6rem', padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t?.home?.howItWorks?.title || "How It Works"}</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t?.home?.howItWorks?.subtitle || "Elite Service Pipeline"}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
          {[
            { title: t?.home?.howItWorks?.step1Title, desc: t?.home?.howItWorks?.step1Desc, icon: <Sparkles size={32} /> },
            { title: t?.home?.howItWorks?.step2Title, desc: t?.home?.howItWorks?.step2Desc, icon: <Users size={32} /> },
            { title: t?.home?.howItWorks?.step3Title, desc: t?.home?.howItWorks?.step3Desc, icon: <ShieldCheck size={32} /> },
            { title: t?.home?.howItWorks?.step4Title, desc: t?.home?.howItWorks?.step4Desc, icon: <CheckCircle2 size={32} /> }
          ].map((item, i) => (
            <div key={i} className="glass-panel reveal" style={{ padding: '3rem 2rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '2rem', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title || "Vector Step"}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500 }}>{item.desc || "Processing nodes..."}</p>
            </div>
          ))}
        </div>
      </section>
      {/* NEW: Referral Program Passive Income CTA */}
      <section className="container reveal stagger-1" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
        <div className="glass-panel mobile-stack" style={{ 
          padding: 'clamp(1.5rem, 6vw, 4rem)',
          background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--bg-secondary) 100%)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center', 
          gap: 'clamp(2rem, 8vw, 4rem)'
        }}>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-soft)', opacity: 0.1, zIndex: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--accent-soft)', opacity: 0.05, zIndex: 0 }}></div>

          <div style={{ flex: '1 1 500px', zIndex: 1, textAlign: 'inherit' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'rgba(212, 175, 55, 0.1)', 
              color: 'var(--accent-color)', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              marginBottom: '1.5rem',
              letterSpacing: '0.05em'
            }}>
              <Users size={16} /> {t?.home?.referralCTA?.badge || "Expansion"}
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {t?.home?.referralCTA?.title || "Refer & Earn"}
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500 }}>
              {t?.home?.referralCTA?.subtitle || "Join the network expansion."}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {referralCode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: 'var(--surface-1)', 
                    border: '1px solid var(--border-color)', 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{t?.home?.referralCTA?.referralLabel || "Your Code:"}</span>
                    <span style={{ color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em' }}>{referralCode}</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="btn" 
                    style={{ 
                      padding: '0.8rem 1.2rem', 
                      borderRadius: '1rem', 
                      background: copied ? 'var(--accent-color)' : 'var(--surface-2)',
                      color: copied ? 'white' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? (t?.common?.copied || "Copied!") : (t?.common?.copy || "Copy")}
                  </button>
                </div>
              ) : (
                <Link href={`/auth/register?callbackUrl=${encodeURIComponent(pathname)}`}>
                  <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.4)' }}>
                    {t?.home?.referralCTA?.button || "Register Now"} <ChevronRight size={20} />
                  </button>
                </Link>
              )}
            </div>
            {/* ⚠️ Redemption Disclaimer */}
              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-color)' }} />
                {t?.home?.referralCTA?.voucherDisclaimer || "Terms apply."}
              </p>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
               <div className="glass-panel float" style={{ 
                 background: 'var(--surface-1)', 
                 padding: '2.5rem', 
                 borderRadius: '2rem', 
                 boxShadow: 'var(--shadow-xl)',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 gap: '1.5rem'
               }}>
                 <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={40} />
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>2%</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t?.home?.referralCTA?.badge || "Node Bonus"}</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Navigation */}
      <section className="container reveal stagger-2" style={{ maxWidth: '1200px', padding: '4rem 0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1.5rem',
          padding: '1rem 0'
        }}>
          {getIcons().map((item, idx) => (
            <button 
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                const element = document.getElementById(`section-${item.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="cat-item reveal haptic-press"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '1.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: activeTab === item.id ? 'var(--accent-color)' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
                animationDelay: `${idx * 50}ms`
              }}
            >
              <div style={{ 
                backgroundColor: activeTab === item.id ? 'var(--accent-soft)' : 'var(--surface-2)', 
                padding: '1.25rem', 
                borderRadius: '1.25rem',
                color: activeTab === item.id ? 'var(--accent-color)' : 'var(--text-muted)',
                boxShadow: activeTab === item.id ? 'var(--shadow-md)' : 'none',
                transform: activeTab === item.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: activeTab === item.id ? 800 : 600, fontFamily: 'var(--font-heading)' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Service Sections */}
      {[
        { id: 'plumbing', data: t?.home?.sections?.plumbing, bg: 'var(--bg-primary)', img1: '/images/plumbing_main.png', img2: '/images/plumbing_detail.png' },
        { id: 'repairs', data: t?.home?.sections?.repairs, bg: 'var(--bg-secondary)', img1: '/images/repairs_main.png', img2: '/images/repairs_detail.png' },
        { id: 'accounting', data: t?.home?.sections?.accounting, bg: 'var(--bg-primary)', fullImg: '/images/accounting_hero.png' },
        { id: 'renovation', data: t?.home?.sections?.renovation, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop' },
        { id: 'education', data: t?.home?.sections?.education, bg: 'var(--bg-primary)', fullImg: '/images/education_hero.png' },
        { id: 'cleaning', data: t?.home?.sections?.cleaning, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop' },
        { id: 'legal', data: t?.home?.sections?.legal, bg: 'var(--bg-primary)', fullImg: '/images/legal_hero.png' },
        { id: 'commercial', data: t?.home?.sections?.commercial, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop' }
      ].map((sec, idx) => (
        <section key={sec.id} id={`section-${sec.id}`} style={{ backgroundColor: sec.bg, padding: 'clamp(4rem, 10vw, 8rem) 0', overflow: 'hidden' }}>
          <div className="container">
            <div className="mobile-stack" style={{ 
              display: 'flex', 
              gap: 'clamp(2rem, 8vw, 5rem)', 
              alignItems: 'center', 
              flexDirection: isRTL ? (idx % 2 === 0 ? 'row-reverse' : 'row') : (idx % 2 === 0 ? 'row' : 'row-reverse')
            }}>
              <div className="reveal" style={{ flex: '1 1 500px', textAlign: 'inherit' }}>
                <div style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '1.5px', background: 'var(--accent-color)' }}></div>
                  {t?.merchant?.background || "Background"}
                </div>
                <h2 style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>{sec?.data?.title || "Node Sector"}</h2>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 500 }}>{sec?.data?.desc || "Processing sectoral transmission..."}</p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.25rem' 
                }}>
                  {(sec?.data?.items as string[] || []).map((sub: string) => (
                    <Link key={sub} 
                          href={`/services/${sec.id}/search?q=${encodeURIComponent(sub)}`} 
                          style={{ textDecoration: 'none' }}>
                      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', background: 'var(--surface-1)' }}>
                        <div style={{ color: 'var(--accent-color)', display: 'flex' }}><CheckCircle2 size={18} strokeWidth={2.5} /></div>
                        {sub}
                      </div>
                    </Link>
                  ))}
                </div>

                {sec.id === 'education' && (
                  <Link href="/services/education" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t?.education_sec?.visitDashboard || "Visit Academy"} <ChevronRight size={18} />
                    </button>
                  </Link>
                )}
              </div>
              
              <div className="reveal" style={{ flex: '1 1 500px' }}>
                 {sec.fullImg ? (
                   <div className="hover-scale" style={{ position: 'relative' }}>
                     <img src={sec.fullImg} alt={sec.data.title} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }} />
                     <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }}></div>
                   </div>
                 ) : (
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <img className="float" src={sec.img1} alt={sec.id} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
                      <img className="float" src={sec.img2} alt={sec.id} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', marginTop: '4rem', animationDelay: '1s' }} />
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Top Rated Specialists Section */}
      <section id="discovery" style={{ padding: '8rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="reveal active" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.2rem' }}>{t.home.recommendation.title2}</div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              {t?.home?.eliteLocal} <span style={{ color: 'var(--accent-color)' }}>{t?.search?.filters}</span>
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>
              {t?.home?.recommendation?.subtitle}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2.5rem',
            marginBottom: '4rem' 
          }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-panel" style={{ height: '400px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
              ))
            ) : merchants.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                {t?.home?.noResults || "Scanning specialist nodes..."}
              </div>
            ) : (
              merchants.map((m: any, idx) => (
                <SpecialistCard key={m.id} specialist={m} idx={idx} city={city} />
              ))
            )}
          </div>

          <div style={{ textAlign: 'center' }} className="reveal">
             <Link href="/services">
                <button className="btn" style={{ padding: '1rem 3rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 800, border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', background: 'transparent' }}>
                  {t?.footer?.explore || "Explore All"} <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
                </button>
             </Link>
          </div>
        </div>
      </section>

      {/* Floating AI Diagnosis Button - Stacked above the Concierge */}
      <Link href="/diagnosis" style={{ position: 'fixed', bottom: '135px', right: '45px', zIndex: 100, textDecoration: 'none' }}>
        <button className="btn btn-primary float" style={{ 
          padding: '1.25rem', 
          borderRadius: '50%', 
          width: '70px', 
          height: '70px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--gold-600), var(--gold-800))',
          boxShadow: '0 10px 30px rgba(184, 134, 11, 0.5)',
          border: '2px solid white',
          position: 'relative'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={28} style={{ opacity: 0.9 }} />
            <Sparkles size={18} style={{ position: 'absolute', top: '-8px', right: '-8px', color: '#fff' }} />
          </div>
        </button>
      </Link>
    </div>
  );
}

function SpecialistCard({ specialist, idx, city }: { specialist: any, idx: number, city: string }) {
  const { t } = useTranslation();
  const [imageIdx, setImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const portfolio = specialist.portfolio || [];
  const images = portfolio.length > 0 
    ? portfolio.map((p: any) => p.imageUrl)
    : [`https://images.unsplash.com/photo-${1581578731548 + idx}?q=80&w=600&auto=format&fit=crop`];

  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setImageIdx(prev => (prev + 1) % images.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setImageIdx(0);
    }
  }, [isHovered, images.length]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel reveal active stagger-${(idx % 4) + 1} haptic-press`} 
      style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img 
          src={images[imageIdx]} 
          alt={specialist.companyName} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
            opacity: 1
          }} 
        />
        {/* Progress Bar for Image Cycle */}
        {isHovered && images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', zIndex: 5 }}>
            <div style={{ 
              height: '100%', 
              background: 'var(--accent-color)', 
              width: `${((imageIdx + 1) / images.length) * 100}%`,
              transition: 'width 1.5s linear'
            }} />
          </div>
        )}
        
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--glass-bg)', padding: '0.4rem 0.85rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}>
          <Star size={14} fill="#fbbf24" color="#fbbf24" /> {specialist.rating || (4.5 + Math.random() * 0.4).toFixed(1)}
        </div>
        {idx < 2 && (
          <div className="shimmer-deluxe" style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent-color)', color: 'white', padding: '0.4rem 0.85rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)', zIndex: 10 }}>
            {t?.home?.eliteBadge}
          </div>
        )}
      </div>
      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{specialist.category || t?.home?.defaultCategory}</div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{specialist.companyName || specialist.user?.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          <MapPin size={16} /> {specialist.city || city}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
           <Link href={`/merchant/${specialist.id}`} style={{ flex: 1, textDecoration: 'none' }}>
             <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontSize: '0.95rem' }}>{t?.common?.viewProfile}</button>
           </Link>
           <button className="btn" style={{ padding: '0.85rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
             <ShieldCheck size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
