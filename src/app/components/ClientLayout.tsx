'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from "@/components/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import { Globe, User, MapPin, ChevronRight, Navigation, PenTool, Sun, Moon, Droplets, Wrench, GraduationCap, Calculator, Scale, Briefcase, Sparkles, Car, ChevronDown, Star, Menu, X, Mail, Phone, Share2, MessageSquare, LogOut } from "lucide-react";
import NavbarSearch from "@/app/components/NavbarSearch";
import NotificationHub from "@/components/dashboard/NotificationHub";
import { useLocation, ALL_UK } from "@/components/LocationContext";
import { useTheme } from "@/components/ThemeContext";
import { getDictionary } from "@/lib/i18n/dictionary";

export function AppNavbar({ session: serverSession }: { session: any }) {
  const { data: clientSession } = useSession();
  const session = clientSession || serverSession;
  const { t, locale, setLocale, isRTL } = useTranslation();
  const { city, setCity, supportedCities, detectLocation, isLocating } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Dynamic paths based on role
  const isMerchant = session?.user?.role === 'MERCHANT' || session?.user?.role === 'ADMIN';
  const dashboardPath = isMerchant ? '/merchant' : '/member/home';
  const homePath = '/';

  const isObsidianPage = pathname?.startsWith('/join') || pathname?.includes('/merchant') || pathname?.startsWith('/member') || pathname?.startsWith('/admin');
  const obsidianBg = theme === 'dark' ? '#050505' : 'var(--bg-primary)';
  const obsidianGold = '#d4af37';

  // State to manage which dropdown is active
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
    { id: 'plumbing', label: t?.home?.categories?.plumbing, icon: <Droplets size={16} strokeWidth={2} />, path: '/services/plumbing' },
    { id: 'repairs', label: t?.home?.categories?.repairs, icon: <Wrench size={16} strokeWidth={2} />, path: '/services/repairs' },
    { id: 'renovation', label: t?.home?.categories?.renovation, icon: <PenTool size={16} strokeWidth={2} />, path: '/services/renovation' },
    { id: 'education', label: t?.home?.categories?.education, icon: <GraduationCap size={16} strokeWidth={2} />, path: '/services/education' },
    { id: 'accounting', label: t?.home?.categories?.accounting, icon: <Calculator size={16} strokeWidth={2} />, path: '/services/accounting' },
    { id: 'legal', label: t?.home?.categories?.legal, icon: <Scale size={16} strokeWidth={2} />, path: '/services/legal' },
    { id: 'commercial', label: t?.home?.categories?.commercial, icon: <Briefcase size={16} strokeWidth={2} />, path: '/services/commercial' },
    { id: 'cleaning', label: t?.home?.categories?.cleaning, icon: <Sparkles size={16} strokeWidth={2} />, path: '/services/cleaning' }
  ], [t]);

  const displayCity = city === ALL_UK ? t?.home?.allUK : city;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className="show-only-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', color: obsidianGold,
              padding: '0.5rem', alignItems: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link href={homePath} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img 
              src="/images/logo_concierge_ai.png" 
              alt="ConciergeAI Logo" 
              style={{ 
                height: '48px', 
                width: 'auto',
                filter: isObsidianPage ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.2))' : 'none',
                backgroundColor: 'transparent',
              }} 
            />
          </Link>


          {/* Concise Language Switcher (Moved next to Logo) */}
          <div className="hide-on-mobile" style={{ position: 'relative', marginLeft: '0.2rem' }}>
            <div 
              onClick={() => toggleDropdown('languages')}
              className="hover-border active-scale fluid-nav-item"
              style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', 
                cursor: 'pointer', padding: '0.3rem 0.6rem', 
                borderRadius: '0.6rem', 
                border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--border-color)'}`,
                backgroundColor: activeDropdown === 'languages' ? (isObsidianPage ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)') : 'transparent', 
                color: obsidianGold,
                fontWeight: 800, transition: 'all 0.2s',
                fontSize: '0.75rem'
              }}>
               <Globe size={14} color={obsidianGold} />
               <span>{(languages.find(l => l.code === locale)?.label || 'EN').split(' ')[0].substring(0, 2).toUpperCase()}</span>
               <ChevronDown size={12} style={{ transform: activeDropdown === 'languages' ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', opacity: 0.6 }} />
            </div>

            {activeDropdown === 'languages' && (
              <div style={{
                position: 'absolute', top: '100%', left: '0', marginTop: '0.5rem',
                width: '160px', 
                backgroundColor: isObsidianPage ? '#0f0f0f' : 'var(--surface-1)', 
                borderRadius: '0.75rem',
                boxShadow: isObsidianPage ? '0 20px 40px rgba(0,0,0,0.8)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--border-color)'}`,
                padding: '0.4rem', zIndex: 1000,
                backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', gap: '2px',
                maxHeight: '400px', overflowY: 'auto'
              }}>
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={(e) => { e.stopPropagation(); setLocale(lang.code as any); setActiveDropdown(null); }}
                    style={{
                      padding: '0.5rem 0.75rem', borderRadius: '0.4rem', cursor: 'pointer',
                      fontSize: '0.85rem', fontWeight: locale === lang.code ? 700 : 500,
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
        </div>
        
        {/* Desktop Nav Items */}
        <div className="hide-on-mobile fluid-nav-gap" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginLeft: '1.5rem' }}>
          {/* City Selector */}
          <div className="fluid-nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isObsidianPage ? (theme === 'dark' ? '#666' : 'var(--text-secondary)') : 'var(--text-secondary)' }}>
             <MapPin size={16} color={obsidianGold} />
             <div 
               onClick={() => toggleDropdown('cities')}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '4px', 
                 cursor: 'pointer', fontWeight: 800, color: obsidianGold,
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
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: isObsidianPage ? 'white' : 'var(--text-primary)' }}>{t?.search?.location}</span>
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
                      {isLocating ? t?.location?.detecting : t?.home?.hero?.badge}
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
                     {t?.home?.allUK}
                   </div>
                 </div>
               </div>
             )}
          </div>


          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => toggleDropdown('services')}
              className="fluid-nav-item"
              style={{ 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', 
                color: obsidianGold, 
                fontWeight: 700, padding: '0.5rem 0'
              }}
            >
              {t?.nav?.browse}
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
                      {t?.nav?.view_all || 'View All Categories'} →
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/diagnosis" className="fluid-nav-item" style={{ 
            color: obsidianGold, 
            fontWeight: 800, 
            textDecoration: 'none', 
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <PenTool size={18} /> {t?.nav?.aiDiagnosis}
          </Link>

          {!session?.user && (
            <Link href="/join" className="hover-bg fluid-nav-item hide-on-narrow-desktop" style={{ 
              color: obsidianGold, 
              fontWeight: 800, 
              textDecoration: 'none', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              transition: '0.2s'
            }}>
              <Briefcase size={18} /> {t?.nav?.join}
            </Link>
          )}
          
          {session?.user?.role === 'MERCHANT' && (
            <Link href="/merchant" className="hover-bg fluid-nav-item hide-on-tablet" style={{ 
              color: obsidianGold, 
              fontWeight: 800, 
              textDecoration: 'none', 
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.75rem',
              transition: '0.2s'
            }}>
              <Briefcase size={18} /> {t?.common?.merchantPortal || "Merchant Node"}
            </Link>
          )}
          
          <div className="fluid-search-container">
            <NavbarSearch />
          </div>

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
            className="hover-scale active-scale"
            title={theme === 'light' ? (t?.common?.dark_mode || 'Switch to Dark Mode') : (t?.common?.light_mode || 'Switch to Light Mode')}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {session?.user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <NotificationHub />
              <Link href={dashboardPath} style={{ color: obsidianGold, fontWeight: 600, textDecoration: 'none' }}>

                <span style={{ 
                  backgroundColor: isObsidianPage ? 'rgba(212,175,55,0.1)' : 'var(--accent-soft)', 
                  padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}>
                  <User size={16} /> {session.user.name} 
                </span>
              </Link>
              {pathname !== '/auth/login' && pathname !== '/auth/register' && (
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hover-scale"
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: '#ef4444', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap',
                    padding: '0.4rem'
                  }}
                >
                  <LogOut size={16} />
                  <span className="hide-on-tablet">
                    {t?.nav?.logout || (locale === 'en' ? 'Sign Out' : '登出')}
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`} className="fluid-nav-item" style={{ 
                textDecoration: 'none', color: obsidianGold, fontWeight: 700
              }}>{t?.nav?.login}</Link>
              <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)', opacity: 0.5 }}></div>
              <Link href={`/auth/register?callbackUrl=${encodeURIComponent(pathname)}`} className="btn btn-primary fluid-nav-item" style={{ 
                textDecoration: 'none', padding: '0.5rem 1.25rem',
                backgroundColor: isObsidianPage ? obsidianGold : 'var(--accent-color)',
                color: isObsidianPage ? 'black' : 'white'
              }}>{t?.nav?.register}</Link>
            </div>
          )}
        </div>

        {/* Mobile Header Icons (Always visible) */}
        <div className="show-only-mobile" style={{ 
          alignItems: 'center', gap: '1rem' 
        }}>
          <button 
             onClick={toggleTheme}
             style={{ background: 'none', border: 'none', color: obsidianGold, padding: '0.5rem' }}
          >
             {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          {session?.user ? (
            <Link href={dashboardPath} style={{ color: obsidianGold }}>
               <User size={22} />
            </Link>

          ) : (
            <Link href="/auth/login" style={{ color: obsidianGold }}>
               <User size={22} />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ 
          position: 'fixed', top: '80px', left: 0, width: '100%', height: 'calc(100vh - 80px)',
          background: isObsidianPage ? '#050505' : 'var(--bg-primary)',
          zIndex: 99, padding: '2rem', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '2rem'
        }}>
           {/* Section 1: Search & Diagnosis */}
           <div>
              <h4 style={{ color: obsidianGold, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>{t?.nav?.quickActions}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ width: '100%' }}><NavbarSearch /></div>
                 <Link href="/diagnosis" onClick={() => setMobileMenuOpen(false)} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '1rem',
                    background: 'var(--accent-soft)', color: obsidianGold, textDecoration: 'none', fontWeight: 800
                 }}>
                    <PenTool size={20} /> {t?.nav?.aiDiagnosis}
                 </Link>
              </div>
           </div>

           {/* Section 2: Location & Language */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div onClick={() => toggleDropdown('mobile-cities')} style={{ 
                padding: '1rem', borderRadius: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: obsidianGold, fontWeight: 800, fontSize: '0.8rem' }}>
                    <MapPin size={16} /> {t?.search?.location}
                 </div>
                 <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: obsidianGold }}>
                    {displayCity} <ChevronDown size={14} />
                 </div>
              </div>

              <div onClick={() => toggleDropdown('mobile-langs')} style={{ 
                padding: '1rem', borderRadius: '1rem', background: 'var(--surface-2)', border: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: obsidianGold, fontWeight: 800, fontSize: '0.8rem' }}>
                    <Globe size={16} /> {t?.legal?.ui?.selectLanguage}
                 </div>
                 <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: obsidianGold }}>
                    {currentLanguage.label.split(' ')[0]} <ChevronDown size={14} />
                 </div>
              </div>
           </div>

           {/* Location Dropdown Mobile */}
           {activeDropdown === 'mobile-cities' && (
             <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {sortedCities.map(c => (
                  <button key={c} onClick={() => { setCity(c); setActiveDropdown(null); }} style={{ 
                    padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: city === c ? obsidianGold : 'var(--surface-3)',
                    color: city === c ? 'black' : 'inherit', fontWeight: 700, fontSize: '0.8rem'
                  }}>{c}</button>
                ))}
             </div>
           )}

           {/* Language Dropdown Mobile */}
           {activeDropdown === 'mobile-langs' && (
             <div className="glass-panel" style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {languages.map(l => (
                  <button key={l.code} onClick={() => { setLocale(l.code as any); setActiveDropdown(null); }} style={{ 
                    padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: locale === l.code ? obsidianGold : 'var(--surface-3)',
                    color: locale === l.code ? 'black' : 'inherit', fontWeight: 700, fontSize: '0.8rem'
                  }}>{l.label}</button>
                ))}
             </div>
           )}

           {/* Section 3: Services */}
           <div>
              <h4 style={{ color: obsidianGold, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>{t?.nav?.exploreServices}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                 {servicesList.map(s => (
                   <Link key={s.id} href={s.path} onClick={() => setMobileMenuOpen(false)} style={{ 
                      padding: '1rem', borderRadius: '0.75rem', background: 'var(--surface-1)', border: '1px solid var(--border-color)',
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', fontWeight: 600, fontSize: '0.85rem'
                   }}>
                      <div style={{ color: obsidianGold }}>{s.icon}</div> {s.label}
                   </Link>
                 ))}
              </div>
           </div>

           {/* Auth CTA Mobile */}
           <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {!session?.user && (
               <Link href="/join" onClick={() => setMobileMenuOpen(false)} style={{ 
                 width: '100%', padding: '1rem', textAlign: 'center', borderRadius: '1rem',
                 border: `1.5px solid ${obsidianGold}`, color: obsidianGold, fontWeight: 900, textDecoration: 'none'
               }}>{t?.nav?.join}</Link>
             )}
             
             {!session?.user && (
               <div style={{ display: 'flex', gap: '0.75rem' }}>
                 <Link href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`} onClick={() => setMobileMenuOpen(false)} style={{ 
                   flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '1rem',
                   background: 'transparent', border: '1.5px solid var(--border-color)', color: obsidianGold, fontWeight: 900, textDecoration: 'none'
                 }}>{t?.nav?.login}</Link>
                 <Link href={`/auth/register?callbackUrl=${encodeURIComponent(pathname)}`} onClick={() => setMobileMenuOpen(false)} style={{ 
                   flex: 1, padding: '1rem', textAlign: 'center', borderRadius: '1rem',
                   background: obsidianGold, color: 'black', fontWeight: 900, textDecoration: 'none'
                 }}>{t?.nav?.register}</Link>
               </div>
             )}
           </div>
        </div>
      )}
    </header>
  );
}

export function AppFooter() {
  const { t, isRTL } = useTranslation();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isObsidianPage = pathname?.startsWith('/join') || pathname?.includes('/merchant') || pathname?.startsWith('/member') || pathname?.startsWith('/admin');
  const { theme } = useTheme();
  
  // Dynamic paths based on role
  const isMerchant = session?.user?.role === 'MERCHANT' || session?.user?.role === 'ADMIN';
  const dashboardPath = isMerchant ? '/merchant' : '/member/home';
  const homePath = '/';

  const obsidianBg = theme === 'dark' ? '#050505' : 'var(--bg-secondary)';
  const obsidianGold = '#d4af37';

  // Dynamic Settings
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Footer settings fetch failed", err));
  }, []);

  // Helpers to fallback to translation if DB is not ready or missing fields
  const getVal = (dbKey: string, tVal: string) => settings?.[dbKey] || tVal;

  return (
    <footer style={{ 
      backgroundColor: isObsidianPage ? obsidianBg : 'var(--bg-secondary)', 
      color: isObsidianPage ? 'white' : 'var(--text-primary)', 
      borderTop: isObsidianPage ? `1px solid rgba(212, 175, 55, 0.1)` : '1px solid var(--border-color)', 
      padding: '5rem 0 3rem 0', 
      marginTop: 'auto',
      direction: isRTL ? 'rtl' : 'ltr',
      transition: 'all 0.5s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Gradient Background for Obsidian Pages */}
      {isObsidianPage && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${obsidianGold}, transparent)`,
          opacity: 0.3
        }}></div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '3rem', 
          marginBottom: '4rem', 
          textAlign: isRTL ? 'right' : 'left'
        }}>
           {/* Brand & About Column */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 1' }}>
              {/* Note: In Footer, we usually link back to home '/' or the dynamic homePath */}
              <Link href={homePath} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
              <p style={{ 
                color: isObsidianPage ? '#aaa' : 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                lineHeight: 1.7,
                maxWidth: '300px'
              }}>
                {getVal('aboutUs', t?.footer?.aboutUs || 'ConciergeAI UK - Elite Service Network')}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {[
                  { name: 'Facebook', url: settings?.facebookUrl || t?.footer?.social?.facebook || '#', svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
                  { name: 'Twitter', url: settings?.twitterUrl || t?.footer?.social?.twitter || '#', svg: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/> },
                  { name: 'Instagram', url: settings?.instagramUrl || t?.footer?.social?.instagram || '#', svg: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
                  { name: 'LinkedIn', url: settings?.linkedinUrl || t?.footer?.social?.linkedin || '#', svg: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></> }
                ].map((social, idx) => (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" style={{
                    color: isObsidianPage ? '#888' : 'var(--text-muted)',
                    transition: 'color 0.3s ease',
                    padding: '8px',
                    borderRadius: '50%',
                    background: isObsidianPage ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} className="social-icon-hover" title={social.name}>
                    <svg 
                      viewBox="0 0 24 24" 
                      width="18" 
                      height="18" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      {social.svg}
                    </svg>
                  </a>
                ))}
              </div>
           </div>

           {/* Services Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t?.footer?.explore || 'Explore'}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {[
                   { name: t?.footer?.homeCleaning || 'Home Cleaning', href: "/services/cleaning" },
                   { name: t?.footer?.plumbingServices || 'Plumbing', href: "/services/plumbing" },
                   { name: (t?.footer?.blog || 'Blog'), href: "/blog" },
                   { name: (t?.footer?.aiDiagnosis || 'AI Diagnosis') + " ✨", href: "/diagnosis", highlight: true }
                 ].map((link, idx) => (
                   <Link key={idx} href={link.href} style={{ 
                     color: link.highlight ? obsidianGold : (isObsidianPage ? '#888' : 'var(--text-secondary)'), 
                     textDecoration: 'none', 
                     fontSize: '0.95rem', 
                     fontWeight: link.highlight ? 700 : 500,
                     transition: 'all 0.3s ease'
                   }} className="link-hover">
                     {link.name}
                   </Link>
                 ))}
              </nav>
           </div>

           {/* Legal Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t?.footer?.legal || 'Legal'}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {[
                   { name: t?.footer?.terms || 'Terms', href: "/legal/terms" },
                   { name: t?.footer?.privacy || 'Privacy', href: "/legal/privacy" },
                   { name: t?.footer?.cookies || 'Cookies', href: "/legal/cookies" },
                   { name: "Sitemap", href: "/sitemap" }
                 ].map((link, idx) => (
                   <Link key={idx} href={link.href} style={{ 
                     color: isObsidianPage ? '#888' : 'var(--text-secondary)', 
                     textDecoration: 'none', 
                     fontSize: '0.9rem',
                     transition: 'all 0.3s ease'
                   }} className="link-hover">
                     {link.name}
                   </Link>
                 ))}
              </nav>
           </div>

           {/* For Specialists Column */}
           <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t?.footer?.forPros || 'For Specialists'}</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {[
                   { name: t?.footer?.merchantRegistration || 'Specialist Join', href: "/join" },
                   { name: t?.nav?.login || 'Specialist Login', href: "/auth/login" },
                   { name: t?.footer?.merchantPortal || 'Merchant Portal', href: "/merchant" }
                 ].map((link, idx) => (
                   <Link key={idx} href={link.href} style={{ 
                     color: isObsidianPage ? '#888' : 'var(--text-secondary)', 
                     textDecoration: 'none', 
                     fontSize: '0.9rem',
                     transition: 'all 0.3s ease'
                   }} className="link-hover">
                     {link.name}
                   </Link>
                 ))}
              </nav>
           </div>

           {/* Contact & Support Column */}
           <div style={{ gridColumn: 'span 1' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem', color: isObsidianPage ? 'white' : 'inherit' }}>{t?.footer?.support || 'Support'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={18} color={obsidianGold} style={{ marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9rem', color: isObsidianPage ? '#888' : 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {getVal('officeAddress', t?.footer?.address || 'London, UK')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={18} color={obsidianGold} />
                    <a href={`tel:${getVal('contactPhone', t?.footer?.phone || '')}`} style={{ fontSize: '0.9rem', color: isObsidianPage ? '#888' : 'var(--text-secondary)', textDecoration: 'none' }} className="link-hover">
                      {getVal('contactPhone', t?.footer?.phone || 'Contact Us')}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <Mail size={18} color={obsidianGold} />
                     <a href={`mailto:${getVal('contactEmail', t?.footer?.email || '')}`} style={{ fontSize: '0.9rem', color: isObsidianPage ? '#888' : 'var(--text-secondary)', textDecoration: 'none' }} className="link-hover">
                       {getVal('contactEmail', t?.footer?.email || 'Email Support')}
                     </a>
                  </div>
              </div>
           </div>
        </div>

        {/* Divider */}
        <div style={{ 
          height: '1px', 
          width: '100%', 
          background: isObsidianPage ? 'rgba(255,255,255,0.05)' : 'var(--border-color)',
          marginBottom: '2rem'
        }}></div>

        {/* Bottom Bar: Copyright & Statutory Info */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
           {/* Trust Signal */}
           <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              background: isObsidianPage ? 'rgba(255,255,255,0.03)' : 'var(--surface-1)',
              border: `1px solid ${isObsidianPage ? 'rgba(212,175,55,0.15)' : 'var(--border-color)'}`,
              boxShadow: 'var(--shadow-sm)'
           }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <Star size={14} fill="#00b67a" color="#00b67a" />
                 <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isObsidianPage ? 'white' : 'var(--text-primary)', marginLeft: '2px' }}>Trustpilot</span>
              </div>
              <div style={{ width: '1px', height: '14px', background: 'rgba(128,128,128,0.3)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: obsidianGold }}>{t?.footer?.trustSignal || 'Excellent on Trustpilot'}</span>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <p style={{ color: isObsidianPage ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
               © {new Date().getFullYear()} {getVal('companyName', 'Concierge AI')}. {t?.footer?.rights || 'All rights reserved.'}
             </p>
             <p style={{ color: isObsidianPage ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
               Registered in England & Wales: {getVal('companyRegistration', t?.footer?.companyNo || '12345678')} | 
               VAT: {getVal('vatRegistration', t?.footer?.vatNo || 'GB123456789')}
             </p>
           </div>
        </div>
      </div>
    </footer>
  );
}
