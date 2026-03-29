"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Sparkles, 
  Loader2, CheckCircle2, 
  AlertCircle, Car, Home, 
  TrendingUp, ArrowRight, Star
} from 'lucide-react';
import { getPersonalizedFeed } from "@/app/actions/ai-discovery";
import Link from "next/link";
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";

export default function RecommendationEngine() {
  const { t, isRTL } = useTranslation();
  const { city } = useLocation();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const res = await getPersonalizedFeed(city);
      if (res.recommendations) setRecommendations(res.recommendations);
      setLoading(false);
    }
    fetch();
  }, [city]);

  if (loading) return (
     <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', overflowX: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: '1rem' }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="animate-pulse" style={{ 
            width: '320px', 
            height: '240px', 
            borderRadius: '24px', 
            flexShrink: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
          }} />
        ))}
     </div>
  );

  return (
    <section className="animate-fade-up" style={{ padding: '2rem 0', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
         <div style={{ textAlign: 'inherit' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexDirection: 'inherit' }}>
               {t.home.recommendation.title1} <span style={{ color: 'var(--accent-color)' }}>{t.home.recommendation.title2}</span>
               <Sparkles size={20} color="var(--accent-color)" />
            </h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem', letterSpacing: '0.01em' }}>
               {t.home.recommendation.subtitle}
            </p>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
         {recommendations.map(rec => (
           <Link 
             key={rec.id} 
             href={`/services?category=${rec.category}&q=${rec.query}`}
             className="glass-panel hover-scale"
             style={{ 
               width: '320px', 
               padding: '1.5rem', 
               borderRadius: '24px', 
               flexShrink: 0, 
               backgroundColor: 'var(--surface-1)', 
               border: '1.5px solid var(--border-color)',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between',
               textDecoration: 'none',
               textAlign: 'inherit'
             }}
           >
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: rec.icon === 'Car' ? '#ecfdf5' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: rec.icon === 'Car' ? '#059669' : '#2563eb' }}>
                       {rec.icon === 'Car' ? <Car size={24} /> : rec.icon === 'Home' ? <Home size={24} /> : <TrendingUp size={24} />}
                    </div>
                    {rec.reason === 'Asset-Match' && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-color)', backgroundColor: 'var(--accent-soft)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                        Mathed Asset
                      </span>
                    )}
                 </div>
                 <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{rec.title}</h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{rec.subtitle}</p>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', flexDirection: 'inherit' }}>
                    {t.home.recommendation.browse} <ArrowRight size={14} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#eab308" color="#eab308" />)}
                 </div>
              </div>
           </Link>
         ))}
      </div>
    </section>
  );
}
