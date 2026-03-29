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
      padding: '8rem 2rem 6rem', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
      overflow: 'hidden',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(37, 99, 235, 0.03)', borderRadius: '50%', filter: 'blur(60px)' }} />

      <div className="container" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem', 
          padding: '0.6rem 1.4rem', backgroundColor: 'white', 
          color: '#2563eb', borderRadius: '2rem', fontSize: '0.9rem', 
          fontWeight: 800, marginBottom: '2rem',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.1)',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <Sparkles size={16} />
          <span>{t.home.hero.badge}</span>
        </div>

        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: 900, 
          lineHeight: 1.1, 
          marginBottom: '1.5rem', 
          letterSpacing: '-0.04em',
          color: '#0f172a' 
        }}>
          {t.home.hero.title1} <br/>
          <span style={{ 
            background: 'linear-gradient(to right, #2563eb, #4f46e5)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>{t.home.hero.title2}</span>
        </h1>

        <p style={{ 
          fontSize: '1.25rem', 
          color: '#475569', 
          maxWidth: '650px', 
          margin: '0 auto 3.5rem',
          lineHeight: 1.6
        }}>
          {t.home.hero.subtitle}
        </p>

        <form 
          onSubmit={handleSearch}
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            padding: '1rem', 
            borderRadius: '1.5rem', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.6)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          <div style={{ flex: 2, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
             <Search size={22} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.25rem', color: '#64748b' }} />
             <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.home.hero.searchPlaceholder}
                style={{ 
                  width: '100%', 
                  padding: `1.25rem ${isRTL ? '3.5rem' : '10rem'} 1.25rem ${isRTL ? '10rem' : '3.5rem'} `, 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '1rem', 
                  color: '#0f172a', 
                  fontSize: '1.1rem', 
                  outline: 'none',
                  textAlign: 'inherit'
                }} 
             />
              <button 
                type="button"
                onClick={() => handleSearch(undefined as any, true)}
                disabled={isAiLoading || !query}
                style={{ 
                  position: 'absolute', [isRTL ? 'left' : 'right']: '0.75rem', 
                  backgroundColor: '#eff6ff', color: '#2563eb', 
                  border: 'none', borderRadius: '0.75rem', padding: '0.5rem', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.75rem', fontWeight: 900,
                  flexDirection: isRTL ? 'row-reverse' : 'row'
                }}
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {t.home.hero.aiMatch}
              </button>
           </div>

          <div style={{ flex: 1, minWidth: '220px', position: 'relative', display: 'flex', alignItems: 'center' }}>
             <MapPin size={22} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.25rem', color: '#64748b' }} />
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
                  padding: '1.25rem 3.5rem', 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '1rem', 
                  color: '#0f172a', 
                  fontSize: '1.1rem', 
                  outline: 'none',
                  textAlign: 'inherit'
                }} 
             />
             <div 
                onClick={detectLocation}
                style={{ 
                  position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', 
                  color: isLocating ? '#2563eb' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                 {isLocating ? <Loader2 size={18} className="animate-spin" /> : <NavIcon size={18} />}
              </div>
          </div>

          <button 
            type="submit"
            className="btn btn-primary" 
            style={{ 
              padding: '0 2.5rem', 
              borderRadius: '1rem', 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              height: 'auto',
              minHeight: '60px',
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              flex: '0 0 auto',
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }}
          >
             {t.home.hero.searchBtn} <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
           {['MOT Testing', 'Oil Change', 'Deep Cleaning', 'Legal Aid'].map(tag => (
             <span key={tag} style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#64748b' }} onClick={() => setQuery(tag)}>
               {isRTL ? '' : 'Popular: '} 
               <strong style={{ textDecoration: 'underline', color: '#2563eb' }}>{tag}</strong>
               {isRTL ? ' :شائع' : ''}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}
