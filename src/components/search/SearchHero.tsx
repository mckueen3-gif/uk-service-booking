"use client";

import { useState } from 'react';
import { Search, MapPin, Sparkles, ArrowRight, Navigation as NavIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseSearchIntent } from '@/app/actions/ai-discovery';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";

export default function SearchHero() {
  const { t, isRTL } = useTranslation();
  const { city, setCity, isLocating, detectLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const router = useRouter();

  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  const handlePostcodeLookup = async (input: string) => {
    if (input.length >= 5 && (postcodeRegex.test(input) || input.split(' ').join('').length > 4)) {
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${input}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 200 && data.result) {
            const resultCity = data.result.admin_district || data.result.parish || data.result.european_electoral_region;
            setCity(resultCity);
          }
        }
      } catch (error) {
        console.warn('Postcode lookup failed:', error);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent, useAi: boolean = false) => {
    if (e) e.preventDefault();
    if (useAi && query.trim()) {
      setIsAiLoading(true);
      const filters = await parseSearchIntent(query);
      setIsAiLoading(false);
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.category) params.set('category', filters.category);
      if (filters.location) params.set('location', filters.location);
      router.push(`/services/results?${params.toString()}`);
    } else {
      router.push(`/services/results?q=${encodeURIComponent(query)}&location=${encodeURIComponent(city)}`);
    }
  };

  return (
    <section style={{ 
      position: 'relative', 
      padding: '10rem 2rem 8rem', 
      textAlign: 'center',
      background: 'var(--soft-gradient)', 
      overflow: 'hidden',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-soft)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.3 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-soft)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.4 }} />

      <div className="container" style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
          padding: '0.6rem 1.4rem', backgroundColor: 'var(--surface-1)', 
          color: 'var(--amber-700)', borderRadius: '2rem', fontSize: '0.9rem', 
          fontWeight: 800, marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <Sparkles size={16} />
          <span>{t.home.hero.badge}</span>
        </div>

        <h1 style={{ 
          fontSize: '5rem', 
          fontWeight: 950, 
          lineHeight: 1, 
          marginBottom: '2rem', 
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)' 
        }}>
          {t.home.hero.title1} <br/>
          <span style={{ 
            background: 'linear-gradient(to right, var(--amber-600), var(--amber-800))', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>{t.home.hero.title2}</span>
        </h1>

        <p style={{ 
          fontSize: '1.4rem', 
          color: 'var(--text-muted)', 
          maxWidth: '750px', 
          margin: '0 auto 4rem',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          {t.home.hero.subtitle}
        </p>

        <form 
          onSubmit={handleSearch}
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-xl)', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(15px)',
            flexWrap: 'wrap',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          <div style={{ flex: 2, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
             <Search size={22} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.5rem', color: 'var(--text-muted)' }} />
             <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.home.hero.searchPlaceholder}
                style={{ 
                  width: '100%', 
                  padding: `1.5rem ${isRTL ? '4rem' : '10rem'} 1.5rem ${isRTL ? '10rem' : '4.5rem'} `, 
                  backgroundColor: 'var(--surface-2)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '1.25rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '1.15rem', 
                  outline: 'none',
                  textAlign: 'inherit',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)'
                }} 
             />
              <button 
                type="button"
                onClick={() => handleSearch(undefined as any, true)}
                disabled={isAiLoading || !query}
                style={{ 
                  position: 'absolute', [isRTL ? 'left' : 'right']: '0.75rem', 
                  backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', 
                  border: 'none', borderRadius: '0.85rem', padding: '0.65rem 1rem', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.8rem', fontWeight: 900,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  transition: 'all 0.2s ease'
                }}
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {t.home.hero.aiMatch}
              </button>
           </div>

          <div style={{ flex: 1, minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
             <MapPin size={22} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.5rem', color: 'var(--text-muted)' }} />
             <input 
                type="text" 
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  handlePostcodeLookup(e.target.value);
                }}
                placeholder={t.home.hero.locationPlaceholder}
                style={{ 
                  width: '100%', 
                  padding: '1.5rem 4rem', 
                  backgroundColor: 'var(--surface-2)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '1.25rem', 
                  color: 'var(--text-primary)', 
                  fontSize: '1.15rem', 
                  outline: 'none',
                  textAlign: 'inherit',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)'
                }} 
             />
             <div 
                onClick={detectLocation}
                style={{ 
                  position: 'absolute', [isRTL ? 'left' : 'right']: '1.25rem', 
                  color: isLocating ? 'var(--accent-color)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                 {isLocating ? <Loader2 size={20} className="animate-spin" /> : <NavIcon size={20} />}
              </div>
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ 
              padding: '0 3rem', 
              borderRadius: '1.25rem', 
              fontSize: '1.1rem', 
              fontWeight: 900, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              height: 'auto',
              minHeight: '75px',
              background: 'linear-gradient(135deg, var(--amber-600), var(--amber-800))',
              flex: '0 0 auto',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.4)'
            }}
          >
             {t.home.hero.searchBtn} <ArrowRight size={22} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '4rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
           {['MOT Testing', 'Oil Change', 'Deep Cleaning', 'Legal Aid'].map(tag => (
             <span key={tag} style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setQuery(tag)}>
               {isRTL ? '' : 'Popular: '} 
               <strong style={{ textDecoration: 'underline', color: 'var(--accent-color)' }}>{tag}</strong>
               {isRTL ? ' :شائع' : ''}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}
