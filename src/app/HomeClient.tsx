"use client";

import { useState, useEffect } from 'react';
import { 
  Search, Wrench, PenTool, Droplets, Sparkles, Briefcase, GraduationCap, Scale, Calculator,
  ChevronRight, ChevronLeft, Star, CheckCircle2, MapPin, Navigation, Car, Loader2, ShieldCheck,
  Users, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SearchHero from '@/components/search/SearchHero';
import RecommendationEngine from '@/components/discovery/RecommendationEngine';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import { searchMerchants } from '@/app/actions/search';
import { ALL_UK } from '@/components/LocationContext';
import { Copy, Check } from 'lucide-react';

export default function HomeClient() {
  const { data: session } = useSession();
  const { t, isRTL } = useTranslation();
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
    { id: 'plumbing', label: t.home.categories.plumbing, icon: <Droplets size={28} strokeWidth={1.5} />, category: 'Plumbing' },
    { id: 'repairs', label: t.home.categories.repairs, icon: <Wrench size={28} strokeWidth={1.5} />, category: 'Repairs' },
    { id: 'renovation', label: t.home.categories.renovation, icon: <PenTool size={28} strokeWidth={1.5} />, category: 'Renovation' },
    { id: 'education', label: t.home.categories.education, icon: <GraduationCap size={28} strokeWidth={1.5} />, category: 'Education' },
    { id: 'accounting', label: t.home.categories.accounting, icon: <Calculator size={28} strokeWidth={1.5} />, category: 'Accounting' },
    { id: 'legal', label: t.home.categories.legal, icon: <Scale size={28} strokeWidth={1.5} />, category: 'Legal' },
    { id: 'commercial', label: t.home.categories.commercial, icon: <Briefcase size={28} strokeWidth={1.5} />, category: 'Commercial' },
    { id: 'cleaning', label: t.home.categories.cleaning, icon: <Sparkles size={28} strokeWidth={1.5} />, category: 'Cleaning' },
    { id: 'car', label: t.home.categories.car, icon: <Car size={28} strokeWidth={1.5} />, category: 'Automotive' },
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
      } catch (err) {
        console.error("Failed to fetch merchants:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocalMerchants();
  }, [city, activeTab]);

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

      {/* NEW: AI Instant Diagnosis CTA */}
      <section className="container reveal stagger-1" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
        <div className="glass-panel" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '3rem', 
          padding: '3rem',
          background: 'var(--soft-gradient)',
          flexWrap: 'wrap',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Decorative Background Element */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, var(--emerald-100) 0%, transparent 70%)', opacity: 0.5 }}></div>

          <div style={{ flex: '1 1 400px', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--emerald-600)', color: 'white', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
              <Sparkles size={14} /> {t.home.aiCTA.badge}
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {t.home.aiCTA.title1} <br />
              <span style={{ color: 'var(--emerald-600)' }}>{t.home.aiCTA.title2}</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500 }}>
              {t.home.aiCTA.subtitle}
            </p>
            <Link href="/diagnosis">
              <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
                {t.home.aiCTA.button} <ChevronRight size={20} />
              </button>
            </Link>
          </div>
          
          <div style={{ flex: '1 1 300px', height: '400px', zIndex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
             <img src="/images/ai-diagnosis-hero.png" alt="AI Diagnosis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>
      {/* NEW: Referral Program Passive Income CTA */}
      <section className="container reveal stagger-1" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
        <div className="glass-panel" style={{ 
          padding: '4rem',
          background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--bg-secondary) 100%)',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '4rem',
          flexWrap: 'wrap'
        }}>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-soft)', opacity: 0.1, zIndex: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'var(--accent-soft)', opacity: 0.05, zIndex: 0 }}></div>

          <div style={{ flex: '1 1 500px', zIndex: 1, textAlign: 'inherit' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'rgba(5, 150, 105, 0.1)', 
              color: 'var(--accent-color)', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              marginBottom: '1.5rem',
              letterSpacing: '0.05em'
            }}>
              <Users size={16} /> {t.home.referralCTA.badge}
            </div>
            <h2 style={{ fontSize: '3.2rem', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {t.home.referralCTA.title}
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 500 }}>
              {t.home.referralCTA.subtitle}
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
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{t.home.referralCTA.referralLabel}</span>
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
                    {copied ? t.common.copied : t.common.copy}
                  </button>
                </div>
              ) : (
                <Link href="/auth/register">
                  <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)' }}>
                    {t.home.referralCTA.button} <ChevronRight size={20} />
                  </button>
                </Link>
              )}
            </div>
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
                    <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.home.referralCTA.badge}</div>
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
                if (item.id === 'car') {
                    window.location.href = '/booking/car';
                    return;
                }
                setActiveTab(item.id);
                const element = document.getElementById(`section-${item.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="cat-item reveal"
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
        { id: 'plumbing', data: t.home.sections.plumbing, bg: 'var(--bg-primary)', img1: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13d?q=80&w=800&auto=format&fit=crop' },
        { id: 'repairs', data: t.home.sections.repairs, bg: 'var(--bg-secondary)', img1: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1595814433015-e6f5cd69614e?q=80&w=800&auto=format&fit=crop' },
        { id: 'accounting', data: t.home.sections.accounting, bg: 'var(--bg-primary)', fullImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop' },
        { id: 'renovation', data: t.home.sections.renovation, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop' },
        { id: 'education', data: t.home.sections.education, bg: 'var(--bg-primary)', fullImg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop' },
        { id: 'cleaning', data: t.home.sections.cleaning, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1200&auto=format&fit=crop' },
        { id: 'legal', data: t.home.sections.legal, bg: 'var(--bg-primary)', fullImg: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&auto=format&fit=crop' },
        { id: 'commercial', data: t.home.sections.commercial, bg: 'var(--bg-secondary)', fullImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop' }
      ].map((sec, idx) => (
        <section key={sec.id} id={`section-${sec.id}`} style={{ backgroundColor: sec.bg, padding: '8rem 0', overflow: 'hidden' }}>
          <div className="container">
            <div style={{ 
              display: 'flex', 
              gap: '5rem', 
              alignItems: 'center', 
              flexDirection: isRTL ? (idx % 2 === 0 ? 'row-reverse' : 'row') : (idx % 2 === 0 ? 'row' : 'row-reverse')
            }}>
              <div className="reveal" style={{ flex: '1 1 500px', textAlign: 'inherit' }}>
                <div style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '1.5px', background: 'var(--accent-color)' }}></div>
                  {t.merchant.background}
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>{sec.data.title}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 500 }}>{sec.data.desc}</p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.25rem' 
                }}>
                  {sec.data.items.map(sub => (
                    <Link key={sub} 
                          href={sec.id === 'education' ? `/education/search?q=${encodeURIComponent(sub)}` : `/services/results?q=${sub}`} 
                          style={{ textDecoration: 'none' }}>
                      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', background: 'var(--surface-1)' }}>
                        <div style={{ color: 'var(--accent-color)', display: 'flex' }}><CheckCircle2 size={18} strokeWidth={2.5} /></div>
                        {sub}
                      </div>
                    </Link>
                  ))}
                </div>

                {sec.id === 'education' && (
                  <Link href="/education" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Visit Education Dashboard <ChevronRight size={18} />
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
              Elite Local <span style={{ color: 'var(--accent-color)' }}>{t.search.filters}</span>
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>
              {t.home.hero.subtitle}
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
                No specialists found in this category.
              </div>
            ) : (
              merchants.map((m: any, idx) => (
                <div key={m.id} className={`glass-panel reveal stagger-${(idx % 4) + 1}`} style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '220px' }}>
                    <img src={m.portfolio?.[0]?.imageUrl || `https://images.unsplash.com/photo-${1581578731548 + idx}?q=80&w=600&auto=format&fit=crop`} alt={m.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--glass-bg)', padding: '0.4rem 0.85rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" /> {m.rating || (4.5 + Math.random() * 0.4).toFixed(1)}
                    </div>
                    {idx < 2 && (
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent-color)', color: 'white', padding: '0.4rem 0.85rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}>
                        Elite Pro
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{m.category || 'Service Expert'}</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{m.companyName || m.user?.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 500 }}>
                      <MapPin size={16} /> {m.city || city}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                       <Link href={`/merchant/${m.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                         <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontSize: '0.95rem' }}>View Profile</button>
                       </Link>
                       <button className="btn" style={{ padding: '0.85rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                         <ShieldCheck size={20} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ textAlign: 'center' }} className="reveal">
             <Link href="/services">
                <button className="btn" style={{ padding: '1rem 3rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 800, border: '1.5px solid var(--border-color)', color: 'var(--text-primary)', background: 'transparent' }}>
                  {t.footer.explore} <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
                </button>
             </Link>
          </div>
        </div>
      </section>

      {/* Trustpilot / Review Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>
                <Star size={28} fill="#00b67a" color="#00b67a"/> Trustpilot
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 500 }}>{t.home.reviews.excellent} {t.home.reviews.basedOn} 21,105 reviews</p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ backgroundColor: '#00b67a', color: 'white', padding: '4px', borderRadius: '4px' }}><Star size={18} fill="white" color="white"/></div>)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              {[
                { id: 1, title: "Highly Recommended", desc: "The expert was incredibly professional and efficient. Best booking experience!", author: "Sarah Jenkins" },
                { id: 2, title: "Exceptional Quality", desc: "Found the perfect plumber within minutes. The transparency is amazing.", author: "David Miller" },
              ].map((rev, idx) => (
                <div key={rev.id} className={`glass-panel reveal stagger-${idx + 1}`} style={{ flex: 1, minWidth: '280px', padding: '2rem', textAlign: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#00b67a" color="#00b67a"/>)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.home.reviews.verified}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{rev.title}</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>"{rev.desc}"</p>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{rev.author}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
