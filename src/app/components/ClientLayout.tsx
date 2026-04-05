'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from "@/components/LanguageContext";
import { Globe, User, MapPin, Mail, Phone, LifeBuoy, ChevronRight, Navigation, PenTool, Sun, Moon, Droplets, Wrench, GraduationCap, Calculator, Scale, Briefcase, Sparkles, Car, ChevronDown, Star } from "lucide-react";
import NavbarSearch from "@/app/components/NavbarSearch";
import NotificationHub from "@/components/dashboard/NotificationHub";
import { useLocation, ALL_UK } from "@/components/LocationContext";
import { useTheme } from "@/components/ThemeContext";

export function AppNavbar({ session }: { session: any }) {
  const { t, locale, setLocale, isRTL } = useTranslation();
  const { city, setCity, supportedCities, detectLocation, isLocating } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  
  const isObsidianPage = pathname?.startsWith('/join') || pathname?.includes('/merchant') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  const obsidianBg = theme === 'dark' ? '#050505' : 'var(--bg-primary)';
  const obsidianGold = '#d4af37';

  // State to manage which dropdown is active
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple toggle helper
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const languages = React.useMemo(() => [
    { code: 'en', label: 'English (EN)' },
    { code: 'zh-TW', label: '繁體中文 (ZH)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
    { code: 'ar', label: 'العربية (AR)' },
    { code: 'ja', label: '日本語 (JA)' },
    { code: 'ko', label: '韓國語 (KO)' },
    { code: 'pl', label: 'Polski (PL)' },
    { code: 'ro', label: 'Română (RO)' },
    { code: 'ur', label: 'اردو (UR)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (PA)' }
  ], []);

  const currentLanguage = languages.find(l => l.code === locale) || languages[0];

  const servicesList = React.useMemo(() => [
    { id: 'plumbing', label: t.home.categories.plumbing, icon: <Droplets size={16} strokeWidth={2} />, path: '/services/results?q=Plumbing' },
    { id: 'repairs', label: t.home.categories.repairs, icon: <Wrench size={16} strokeWidth={2} />, path: '/services/results?q=Repairs' },
    { id: 'renovation', label: t.home.categories.renovation, icon: <PenTool size={16} strokeWidth={2} />, path: '/services/results?q=Renovation' },
    { id: 'education', label: t.home.categories.education, icon: <GraduationCap size={16} strokeWidth={2} />, path: '/education' },
    { id: 'accounting', label: t.home.categories.accounting, icon: <Calculator size={16} strokeWidth={2} />, path: '/services/results?q=Accounting' },
    { id: 'legal', label: t.home.categories.legal, icon: <Scale size={16} strokeWidth={2} />, path: '/services/results?q=Legal' },
    { id: 'commercial', label: t.home.categories.commercial, icon: <Briefcase size={16} strokeWidth={2} />, path: '/services/results?q=Commercial' },
    { id: 'cleaning', label: t.home.categories.cleaning, icon: <Sparkles size={16} strokeWidth={2} />, path: '/services/results?q=Cleaning' },
    { id: 'car', label: t.home.categories.car, icon: <Car size={16} strokeWidth={2} />, path: '/booking/car' }
  ], [t]);

  const displayCity = city === ALL_UK ? t.home.allUK : city;

  // Render City Items
  const sortedCities = React.useMemo(() => [...supportedCities].sort(), [supportedCities]);

  return (
    <header 
      ref={navRef as any}
      style={{ 
        height: '80px', 
        background: isObsidianPage ? obsidianBg : 'var(--glass-bg)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isObsidianPage ? `1px solid ${theme === 'dark' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.2)'}` : '1px solid var(--glass-border)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        direction: isRTL ? 'rtl' : 'ltr',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <nav className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/images/logo_concierge_ai.png" 
              alt="ConciergeAI Logo" 
              style={{ 
                height: '56px', 
                width: 'auto',
                filter: isObsidianPage ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.2))' : 'none',
                backgroundColor: 'transparent',
              }} 
            />
          </Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* City Selector (Moved to right section for cleaner dashboard look) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: isObsidianPage ? (theme === 'dark' ? '#666' : 'var(--text-secondary)') : 'var(--text-secondary)' }}>
             <MapPin size={16} color={obsidianGold} />
             <div 
               onClick={() => toggleDropdown('cities')}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '4px', 
                 cursor: 'pointer', fontWeight: 800, color: isObsidianPage ? (theme === 'dark' ? 'white' : 'var(--text-primary)') : 'var(--text-primary)',
                 padding: '0.3rem 0.6rem', borderRadius: '0.6rem',
                 backgroundColor: activeDropdown === 'cities' ? (isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--surface-2)') : 'transparent',
                 transition: '0.2s'
               }}
               className="hover-bg"
             >
               {displayCity}
               <ChevronDown size={14} style={{ transform: activeDropdown === 'cities' ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', opacity: 0.6 }} />
             </div>

             {activeDropdown === 'cities' && (
               <div style={{ 
                 position: 'absolute', top: '100%', left: 0, marginTop: '0.75rem',
                 width: '420px', 
                 backgroundColor: isObsidianPage ? '#0f0f0f' : 'var(--surface-1)', 
                 borderRadius: '1.25rem',
                 boxShadow: isObsidianPage ? '0 20px 40px rgba(0,0,0,0.8)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
                 border: `1.5px solid ${isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--border-color)'}`,
                 padding: '1.5rem', zIndex: 1000,
                 backdropFilter: 'blur(20px)',
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: isObsidianPage ? 'white' : 'var(--text-primary)' }}>{t.search.location}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); detectLocation(); }}
                      disabled={isLocating}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        backgroundColor: isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--accent-soft)', color: obsidianGold,
                        border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.75rem',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                        opacity: isLocating ? 0.7 : 1
                      }}
                    >
                      {isLocating ? (
                        <div className="animate-spin" style={{ width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      ) : (
                        <Navigation size={12} fill="currentColor" />
                      )}
                      {isLocating ? 'Locating...' : t.home.hero.badge}
                    </button>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
                   {sortedCities.map(c => (
                     <div 
                       key={c} 
                       onClick={(e) => { e.stopPropagation(); setCity(c); setActiveDropdown(null); }}
                       style={{ 
                         padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                         fontSize: '0.8rem', textAlign: 'center', transition: '0.2s',
                         backgroundColor: city === c ? obsidianGold : (isObsidianPage ? 'rgba(255,255,255,0.05)' : 'var(--surface-2)'),
                         color: city === c ? 'black' : (isObsidianPage ? 'white' : 'var(--text-secondary)'),
                         fontWeight: city === c ? 800 : 600,
                         border: '1px solid transparent'
                       }}
                       className="hover-scale"
                     >
                       {c}
                     </div>
                   ))}
                   <div 
                      key="all"
                      onClick={(e) => { e.stopPropagation(); setCity(ALL_UK); setActiveDropdown(null); }}
                      style={{ 
                        gridColumn: 'span 3', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                        fontSize: '0.8rem', textAlign: 'center', transition: '0.2s', marginTop: '0.4rem',
                        backgroundColor: city === ALL_UK ? obsidianGold : (isObsidianPage ? 'rgba(255,255,255,0.05)' : 'var(--surface-2)'),
                        color: city === ALL_UK ? 'black' : (isObsidianPage ? 'white' : 'var(--text-secondary)'),
                        fontWeight: 800
                      }}
                   >
                     {t.home.allUK}
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Theme Toggle - Now always visible for better UX in dashboard */}
          <button 
            onClick={toggleTheme}
            style={{ 
              background: isObsidianPage ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'var(--surface-2)') : 'var(--surface-2)', 
              border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.2)' : 'var(--border-color)'}`, 
              borderRadius: '0.75rem', 
              padding: '0.4rem', 
              cursor: 'pointer', 
              color: obsidianGold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="hover-scale"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Premium Custom Language Switcher */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => toggleDropdown('languages')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                cursor: 'pointer', padding: '0.4rem 0.8rem', 
                borderRadius: '2rem', 
                border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.2)' : 'var(--border-color)'}`,
                backgroundColor: activeDropdown === 'languages' ? (isObsidianPage ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)') : (isObsidianPage ? '#0f0f0f' : 'var(--surface-1)'), 
                color: isObsidianPage ? 'white' : 'var(--text-primary)',
                fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                boxShadow: isObsidianPage ? 'none' : 'var(--shadow-sm)'
              }} className="hover-border active-scale">
               <Globe size={16} color={obsidianGold} />
               <span>{currentLanguage.label.split(' ')[0]}</span>
               <ChevronDown size={14} style={{ transform: activeDropdown === 'languages' ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', opacity: 0.6 }} />
            </div>

            {activeDropdown === 'languages' && (
              <div style={{
                position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem',
                width: '180px', 
                backgroundColor: isObsidianPage ? '#0f0f0f' : 'var(--surface-1)', 
                borderRadius: '1rem',
                boxShadow: isObsidianPage ? '0 20px 40px rgba(0,0,0,0.8)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
                border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--border-color)'}`,
                padding: '0.5rem', zIndex: 1000,
                backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', gap: '2px',
                maxHeight: '400px', overflowY: 'auto'
              }}>
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={(e) => { e.stopPropagation(); setLocale(lang.code as any); setActiveDropdown(null); }}
                    style={{
                      padding: '0.6rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer',
                      fontSize: '0.9rem', fontWeight: locale === lang.code ? 700 : 500,
                      backgroundColor: locale === lang.code ? (isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--accent-soft)') : 'transparent',
                      color: locale === lang.code ? obsidianGold : (isObsidianPage ? 'white' : 'var(--text-primary)'),
                      transition: 'all 0.2s'
                    }}
                    className={locale !== lang.code ? "hover-bg" : ""}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => toggleDropdown('services')}
              style={{ 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', 
                color: activeDropdown === 'services' ? obsidianGold : (isObsidianPage ? 'white' : 'var(--text-primary)'), 
                fontWeight: 700, fontSize: '1.05rem', padding: '0.5rem 0'
              }}
            >
              {t.nav.browse}
              <ChevronDown size={14} style={{ transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
            </div>

            {activeDropdown === 'services' && (
              <div style={{
                position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem',
                width: '450px', 
                backgroundColor: isObsidianPage ? '#0f0f0f' : 'var(--surface-1)', 
                borderRadius: '1.25rem',
                boxShadow: isObsidianPage ? '0 20px 40px rgba(0,0,0,0.8)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
                border: `1.5px solid ${isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--border-color)'}`,
                padding: '1.5rem', zIndex: 1000,
                backdropFilter: 'blur(20px)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'
              }}>
                {servicesList.map(s => (
                  <Link key={s.id} href={s.path} style={{ textDecoration: 'none' }} onClick={() => setActiveDropdown(null)}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '10px', 
                      padding: '0.75rem 1rem', borderRadius: '0.75rem',
                      color: isObsidianPage ? '#ccc' : 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem',
                      transition: 'all 0.2s', 
                      backgroundColor: isObsidianPage ? '#171717' : 'var(--surface-2)'
                    }}
                    className="hover-bg hover-scale"
                    >
                      <div style={{ color: obsidianGold }}>{s.icon}</div>
                      {s.label}
                    </div>
                  </Link>
                ))}
                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                  <Link href="/services" style={{ textDecoration: 'none' }} onClick={() => setActiveDropdown(null)}>
                    <div style={{ 
                      width: '100%', textAlign: 'center', 
                      backgroundColor: isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--accent-soft)', 
                      color: obsidianGold, padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.9rem' 
                    }} className="hover-opacity">
                      {isRTL ? 'عرض كافة الفئات' : 'View All Categories'} →
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/diagnosis" style={{ 
            color: obsidianGold, 
            fontWeight: 800, 
            textDecoration: 'none', 
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <PenTool size={18} /> {t.nav.aiDiagnosis}
          </Link>
          
          <div style={{ width: '220px' }}>
            <NavbarSearch />
          </div>
          
          {session?.user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <NotificationHub />
              <Link href="/dashboard" style={{ color: obsidianGold, fontWeight: 600, textDecoration: 'none' }}>
                <span style={{ 
                  backgroundColor: isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--accent-soft)', 
                  padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                }}>
                  <User size={16} /> {session.user.name} 
                </span>
              </Link>
              {!isObsidianPage && <a href="/api/auth/signout" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>{t.nav.logout}</a>}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link href="/join" style={{ color: isObsidianPage ? 'white' : 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1.05rem' }}>{t.nav.join}</Link>
              <Link href="/auth/login" className="btn btn-primary" style={{ 
                textDecoration: 'none', padding: '0.5rem 1.5rem', fontSize: '0.9rem',
                backgroundColor: isObsidianPage ? obsidianGold : 'var(--accent-color)',
                color: isObsidianPage ? 'black' : 'white'
              }}>{t.nav.login}</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export function AppFooter() {
  const { t, isRTL } = useTranslation();
  const pathname = usePathname();
  const isObsidianPage = pathname?.startsWith('/join') || pathname?.includes('/merchant') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  const { theme } = useTheme();
  const obsidianBg = theme === 'dark' ? '#050505' : 'var(--bg-secondary)';
  const obsidianGold = '#d4af37';

  return (
    <footer style={{ 
      backgroundColor: isObsidianPage ? obsidianBg : 'var(--bg-secondary)', 
      color: isObsidianPage ? 'white' : 'var(--text-primary)', 
      borderTop: isObsidianPage ? `1px solid rgba(212, 175, 55, 0.1)` : '1px solid var(--border-color)', 
      padding: '5rem 0 2rem 0', 
      marginTop: 'auto',
      direction: isRTL ? 'rtl' : 'ltr',
      transition: 'all 0.5s ease'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '3rem', 
          marginBottom: '4rem', 
          textAlign: isRTL ? 'right' : 'left'
        }}>
           {/* Brand Column */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginBottom: '0.5rem' }}>
                <img 
                  src="/images/logo_concierge_ai.png" 
                  alt="ConciergeAI" 
                  style={{ 
                    height: '54px', 
                    width: 'auto',
                    filter: isObsidianPage ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.2))' : 'none'
                  }} 
                />
              </Link>
              <p style={{ color: isObsidianPage ? '#888' : 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.footer.tagline}</p>
              <Link href="/join" style={{ 
                marginTop: '0.5rem',
                color: obsidianGold, 
                fontWeight: 700, 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {t.nav.join} <ChevronRight size={14} />
              </Link>
           </div>

           {/* Services Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t.footer.explore}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/services?category=Cleaning" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {isRTL ? 'تنظيف المنزل Cleaning' : 'Home Cleaning'}
                 </Link>
                 <Link href="/services?category=Plumbing" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {isRTL ? 'خدمات السباكة Plumbing' : 'Plumbing Services'}
                 </Link>
                 <Link href="/services?category=Automotive" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {t.faq.categories.disputes} - Automotive
                 </Link>
                 <Link href="/diagnosis" style={{ color: obsidianGold, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
                   {t.footer.aiDiagnosis} ✨
                 </Link>
              </div>
           </div>

           {/* Legal Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t.footer.legal}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/legal/terms" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.terms}</Link>
                 <Link href="/legal/privacy" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.privacy}</Link>
                 <Link href="/legal/cookies" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.cookies}</Link>
              </div>
           </div>

           {/* Support Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t.footer.support}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/help" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>{t.footer.help}</Link>
                 <Link href="/contact" style={{ color: isObsidianPage ? '#666' : 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>{t.footer.contact}</Link>
              </div>
           </div>
        </div>

        <div style={{ 
          borderTop: isObsidianPage ? '1px solid rgba(255,255,255,0.05)' : '1px solid var(--border-color)', 
          paddingTop: '2rem', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
           {/* Subtle Trustpilot Signal */}
           <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              background: isObsidianPage ? 'rgba(255,255,255,0.03)' : 'var(--surface-1)',
              border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.15)' : 'var(--border-color)'}`,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
           }} className="hover-scale">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <Star size={14} fill="#00b67a" color="#00b67a" />
                 <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isObsidianPage ? 'white' : 'var(--text-primary)', marginLeft: '2px' }}>Trustpilot</span>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'var(--border-color)', opacity: 0.5 }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: obsidianGold }}>{t.footer.trustSignal}</span>
           </div>

           <p style={{ color: isObsidianPage ? '#444' : 'var(--text-secondary)', fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} ConciergeAI UK. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
