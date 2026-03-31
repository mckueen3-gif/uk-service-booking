'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";
import { Globe, User, MapPin, Mail, Phone, LifeBuoy, ChevronRight, Navigation, PenTool, Sun, Moon } from "lucide-react";
import NavbarSearch from "@/app/components/NavbarSearch";
import NotificationHub from "@/components/dashboard/NotificationHub";
import { useLocation, ALL_UK } from "@/components/LocationContext";
import { useTheme } from "@/components/ThemeContext";

export function AppNavbar({ session }: { session: any }) {
  const { t, locale, setLocale, isRTL } = useTranslation();
  const { city, setCity, supportedCities, detectLocation } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showCities, setShowCities] = React.useState(false);

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
                      onClick={() => { detectLocation(); setShowCities(false); }}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', 
                        backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)',
                        border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.75rem',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      <Navigation size={12} fill="currentColor" /> {t.home.hero.badge}
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
          
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <NavbarSearch />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Globe size={18} color="var(--accent-color)" />
             <select 
               value={locale} 
               onChange={(e) => setLocale(e.target.value as any)}
               style={{ 
                 backgroundColor: 'var(--surface-1)', 
                 border: '1px solid var(--border-color)', 
                 borderRadius: '0.5rem',
                 padding: '0.2rem 0.5rem',
                 color: 'var(--text-primary)', 
                 fontWeight: 700, 
                 cursor: 'pointer',
                 fontSize: '0.9rem',
                 outline: 'none',
                 direction: 'ltr',
                 boxShadow: 'var(--shadow-sm)'
               }}
             >
               <option value="en" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>English (EN)</option>
               <option value="zh-TW" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>繁體中文 (ZH)</option>
               <option value="hi" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>हिन्दी (HI)</option>
               <option value="ar" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>العربية (AR)</option>
               <option value="ja" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>日本語 (JA)</option>
               <option value="ko" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>한국어 (KO)</option>
               <option value="pl" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>Polski (PL)</option>
               <option value="ro" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>Română (RO)</option>
               <option value="ur" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>اردو (UR)</option>
               <option value="pa" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>ਪੰਜਾਬੀ (PA)</option>
             </select>
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

          <Link href="/services" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1.05rem' }}>
            {t.nav.browse}
          </Link>

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
