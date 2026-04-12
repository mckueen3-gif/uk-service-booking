"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sparkles, ArrowRight, Navigation as NavIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseSearchIntent } from '@/app/actions/ai-discovery';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import { motion, useMotionValue, useSpring } from 'framer-motion';
// Removed individual useEffect import

export default function SearchHero() {
  const { t, isRTL } = useTranslation();
  const { city, setCity, isLocating, detectLocation } = useLocation();
  const [query, setQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const router = useRouter();

  // Aura Glow Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Smart Placeholder Typing Effect
  const [placeholder, setPlaceholder] = useState("");
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const suggestions = [
    t.home.hero.searchPlaceholder,
    ...t.home.hero.suggestions
  ];

  useEffect(() => {
    // Reset state when suggestions change (language switch)
    setSuggestionIdx(0);
    setPlaceholder("");
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    let currentText = "";
    let isDeleting = false;
    let speed = 100;
    let localIdx = 0;

    const type = () => {
      const fullText = suggestions[localIdx % suggestions.length];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        speed = 50;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        speed = 100;
      }

      setPlaceholder(currentText);

      if (!isDeleting && currentText === fullText) {
        isDeleting = true;
        speed = 2000; // Pause at end
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        localIdx++;
        setSuggestionIdx(localIdx);
        speed = 500;
      }

      typingTimeoutRef.current = setTimeout(type, speed);
    };

    typingTimeoutRef.current = setTimeout(type, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [t.home.hero.suggestions.join('|'), t.home.hero.searchPlaceholder]);

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
      padding: 'clamp(6rem, 15vh, 10rem) 1.5rem 6rem', 
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
          color: 'var(--amber-700)', borderRadius: '2rem', fontSize: '0.85rem', 
          fontWeight: 800, marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}>
          <Sparkles size={16} />
          <span>{t.home.hero.badge}</span>
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
          fontWeight: 950, 
          lineHeight: 1, 
          marginBottom: '1.5rem', 
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
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
          color: 'var(--text-muted)', 
          maxWidth: '750px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          {t.home.hero.subtitle}
        </p>

        <form 
          onSubmit={handleSearch}
          onMouseMove={handleMouseMove}
          className="glass-panel mobile-stack aura-container" 
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-xl)', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(15px)',
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}
        >
          {/* Aura Glow Element */}
          <motion.div 
            className="aura-glow"
            style={{ 
              left: springX, 
              top: springY,
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)'
            }} 
          />

          <div style={{ flex: 2, minWidth: 'min(100%, 280px)', position: 'relative', display: 'flex', alignItems: 'center', zIndex: 1 }}>
             <Search size={22} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '1.5rem', color: 'var(--text-muted)' }} />
             <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                style={{ 
                  width: '100%', 
                  padding: isRTL ? '1.5rem 4rem 1.5rem 9rem' : '1.5rem 9rem 1.5rem 4.5rem', 
                  backgroundColor: 'var(--surface-2)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '1.25rem', 
                  color: 'var(--text-primary)', 
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', 
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
                <span className="hide-on-mobile">{t.home.hero.aiMatch}</span>
                <span className="show-only-mobile">AI</span>
              </button>
           </div>

          <div style={{ flex: 1, minWidth: 'min(100%, 220px)', position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', 
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
              width: 'var(--mobile-btn-width, auto)',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.4)'
            }}
          >
             {t.home.hero.searchBtn} <ArrowRight size={22} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
           {t.home.hero.popularTags.map(tag => (
             <span key={tag} style={{ fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '1rem', background: 'var(--surface-1)' }} onClick={() => setQuery(tag)}>
               {!isRTL && `${t.home.hero.popularLabel}: `} 
               <strong style={{ textDecoration: 'underline', color: 'var(--accent-color)' }}>{tag}</strong>
               {isRTL && ` :${t.home.hero.popularLabel}`}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}
