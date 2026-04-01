'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";
import { Globe, User, MapPin, Mail, Phone, LifeBuoy, ChevronRight, Navigation, PenTool, Sun, Moon, Droplets, Wrench, GraduationCap, Calculator, Scale, Briefcase, Sparkles, Car, ChevronDown } from "lucide-react";
import NavbarSearch from "@/app/components/NavbarSearch";
import NotificationHub from "@/components/dashboard/NotificationHub";
import { useLocation, ALL_UK } from "@/components/LocationContext";
import { useTheme } from "@/components/ThemeContext";

export function AppNavbar({ session }: { session: any }) {
  const { t, locale, setLocale, isRTL } = useTranslation();
  const { city, setCity, supportedCities, detectLocation, isLocating } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showCities, setShowCities] = React.useState(false);
  const [showServices, setShowServices] = React.useState(false);
  const [showLanguages, setShowLanguages] = React.useState(false);

  const languages = React.useMemo(() => [
    { code: 'en', label: 'English (EN)' },
    { code: 'zh-TW', label: '繁體中文 (ZH)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
    { code: 'ar', label: 'العربية (AR)' },
    { code: 'ja', label: '日本語 (JA)' },
    { code: 'ko', label: '한국어 (KO)' },
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

  return (
    <header style={{ 
      height: '80px', 
      background: 'var(--glass-bg)', 
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <nav className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <Link href="/" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
            ServiceHub<span style={{ color: 'var(--accent-color)' }}>.</span>
          </Link>

          {/* City Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
             <MapPin size={16} color="var(--accent-color)" />
             <div 
               onClick={() => setShowCities(!showCities)}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '4px', 
                 cursor: 'pointer', fontWeight: 800, color: 'var(--text-primary)',
                 padding: '0.3rem 0.6rem', borderRadius: '0.6rem',
                 backgroundColor: showCities ? 'var(--surface-2)' : 'transparent',
                 transition: '0.2s'
               }}
               className="hover-bg"
             >
               {displayCity}
               <ChevronRight size={14} style={{ transform: showCities ? 'rotate(-90deg)' : 'rotate(90deg)', transition: '0.2s' }} />
             </div>

             {showCities && (
               <div style={{ 
                 position: 'absolute', top: '100%', left: 0, marginTop: '0.75rem',
                 width: '420px', backgroundColor: 'var(--surface-1)', borderRadius: '1.25rem',
                 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                 border: '1.5px solid var(--border-color)',
                 padding: '1.5rem', zIndex: 1000,
                 backdropFilter: 'blur(20px)',
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{t.search.location}</span>
                    <button 
                      onClick={() => { detectLocation(); }}
                      disabled={isLocating}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)',
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

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                   {supportedCities.map(c => (
                     <div 
                       key={c} 
                       onClick={() => { setCity(c); setShowCities(false); }}
                       style={{ 
                         padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                         fontSize: '0.8rem', textAlign: 'center', transition: '0.2s',
                         backgroundColor: city === c ? 'var(--accent-color)' : 'var(--surface-2)',
                         color: city === c ? 'white' : 'var(--text-secondary)',
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
                      onClick={() => { setCity(ALL_UK); setShowCities(false); }}
                      style={{ 
                        gridColumn: 'span 3', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                        fontSize: '0.8rem', textAlign: 'center', transition: '0.2s', marginTop: '0.4rem',
                        backgroundColor: city === ALL_UK ? 'var(--accent-color)' : 'var(--surface-2)',
                        color: city === ALL_UK ? 'white' : 'var(--text-secondary)',
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
          {/* Premium Custom Language Switcher */}
          <div 
             style={{ position: 'relative' }}
             onMouseEnter={() => setShowLanguages(true)}
             onMouseLeave={() => setShowLanguages(false)}
          >
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              cursor: 'pointer', padding: '0.4rem 0.8rem', 
              borderRadius: '2rem', border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
              boxShadow: 'var(--shadow-sm)'
            }} className="hover-border active-scale">
               <Globe size={16} color="var(--accent-color)" />
               <span>{currentLanguage.label.split(' ')[0]}</span>
               <ChevronDown size={14} style={{ transform: showLanguages ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', opacity: 0.6 }} />
            </div>

            {showLanguages && (
              <div style={{
                position: 'absolute', top: '100%', right: '0', marginTop: '0.5rem',
                width: '180px', backgroundColor: 'var(--surface-1)', borderRadius: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                border: '1px solid var(--border-color)',
                padding: '0.5rem', zIndex: 1000,
                backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', gap: '2px',
                maxHeight: '400px', overflowY: 'auto'
              }}>
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => { setLocale(lang.code as any); setShowLanguages(false); }}
                    style={{
                      padding: '0.6rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer',
                      fontSize: '0.9rem', fontWeight: locale === lang.code ? 700 : 500,
                      backgroundColor: locale === lang.code ? 'var(--accent-soft)' : 'transparent',
                      color: locale === lang.code ? 'var(--accent-color)' : 'var(--text-primary)',
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

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'var(--surface-2)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '0.75rem', 
              padding: '0.4rem', 
              cursor: 'pointer', 
              color: 'var(--accent-color)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div 
               style={{ position: 'relative' }}
               onMouseEnter={() => setShowServices(true)}
               onMouseLeave={() => setShowServices(false)}
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem', padding: '0.5rem 0' }}>
                {t.nav.browse}
                <ChevronDown size={14} style={{ transform: showServices ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
              </div>

              {showServices && (
                <div style={{
                  position: 'absolute', top: '100%', left: '-50%',
                  width: '450px', backgroundColor: 'var(--surface-1)', borderRadius: '1.25rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                  border: '1.5px solid var(--border-color)',
                  padding: '1.5rem', zIndex: 1000,
                  backdropFilter: 'blur(20px)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'
                }}>
                   {servicesList.map(s => (
                     <Link key={s.id} href={s.path} style={{ textDecoration: 'none' }} onClick={() => setShowServices(false)}>
                       <div style={{ 
                         display: 'flex', alignItems: 'center', gap: '10px', 
                         padding: '0.75rem 1rem', borderRadius: '0.75rem',
                         color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem',
                         transition: 'all 0.2s', backgroundColor: 'var(--surface-2)'
                       }}
                       className="hover-bg hover-scale"
                       >
                         <div style={{ color: 'var(--accent-color)' }}>{s.icon}</div>
                         {s.label}
                       </div>
                     </Link>
                   ))}
                   <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                     <Link href="/services" style={{ textDecoration: 'none' }} onClick={() => setShowServices(false)}>
                       <div style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 800, fontSize: '0.9rem' }} className="hover-opacity">
                         {isRTL ? 'عرض كافة الفئات' : 'View All Categories'} →
                       </div>
                     </Link>
                   </div>
                </div>
              )}
            </div>
          </div>

          <Link href="/diagnosis" style={{ 
            color: 'var(--accent-color)', 
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
              <Link href="/dashboard" style={{ color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}>
                <span style={{ backgroundColor: 'var(--accent-soft)', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> {session.user.name} 
                </span>
              </Link>
              <a href="/api/auth/signout" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>{t.nav.logout}</a>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link href="/join" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1.05rem' }}>{t.nav.join}</Link>
              <Link href="/auth/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{t.nav.login}</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export function AppFooter() {
  const { t, isRTL } = useTranslation();
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      color: 'var(--text-primary)', 
      borderTop: '1px solid var(--border-color)', 
      padding: '5rem 0 2rem 0', 
      marginTop: 'auto',
      direction: isRTL ? 'rtl' : 'ltr'
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
              <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', textDecoration: 'none' }}>
                ServiceHub<span style={{ color: 'var(--accent-color)' }}>.</span>
              </Link>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.footer.tagline}</p>
              <Link href="/join" style={{ 
                marginTop: '0.5rem',
                color: 'var(--accent-color)', 
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
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>{t.footer.explore}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/services?category=Cleaning" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {isRTL ? 'تنظيف المنزل Cleaning' : 'Home Cleaning'}
                 </Link>
                 <Link href="/services?category=Plumbing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {isRTL ? 'خدمات السباكة Plumbing' : 'Plumbing Services'}
                 </Link>
                 <Link href="/services?category=Automotive" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                   {t.faq.categories.disputes} - Automotive
                 </Link>
                 <Link href="/diagnosis" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700 }}>
                   {t.footer.aiDiagnosis} ✨
                 </Link>
              </div>
           </div>

           {/* Legal Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>{t.footer.legal}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/legal/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.terms}</Link>
                 <Link href="/legal/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.privacy}</Link>
                 <Link href="/legal/cookies" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{t.footer.cookies}</Link>
              </div>
           </div>

           {/* Support Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>{t.footer.support}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <Link href="/help" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>{t.footer.help}</Link>
                 <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>{t.footer.contact}</Link>
              </div>
           </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center' }}>
           <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} ServiceHub UK. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
