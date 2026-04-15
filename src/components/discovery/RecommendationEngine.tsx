"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Sparkles, 
  Loader2, CheckCircle2, 
  AlertCircle, Car, Home, 
  TrendingUp, ArrowRight, Star,
  Hammer, Briefcase, Zap, Wrench
} from 'lucide-react';
import { getPersonalizedFeed } from "@/app/actions/ai-discovery";
import Link from "next/link";
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Repair': return <Hammer size={24} />;
    case 'Cleaning': return <Sparkles size={24} />;
    case 'Accounting': return <Briefcase size={24} />;
    case 'Auto': return <Car size={24} />;
    case 'Home': return <Home size={24} />;
    default: return <Zap size={24} />;
  }
};

export default function RecommendationEngine() {
  const { t, format, isRTL } = useTranslation();
  const { city } = useLocation();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await getPersonalizedFeed(city);
        if (res && res.recommendations) {
          setRecommendations(res.recommendations);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [city]);

  if (loading) return (
     <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', overflowX: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: '1rem' }}>
        {[1,2,3].map(i => (
          <div key={i} className="animate-pulse glass-panel" style={{ 
            width: '100%', 
            minHeight: '260px', 
            borderRadius: '24px', 
            flexShrink: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          }} />
        ))}
     </div>
  );

  return (
    <section className="animate-fade-up discover-section" style={{ padding: '4rem 0', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
         <div className="reveal active">
            <h2 style={{ fontSize: '2.75rem', fontWeight: 950, marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', letterSpacing: '-0.03em' }}>
               {(t?.home?.recommendation?.title1 || t?.home?.recommendation?.title)} <span style={{ 
                 background: 'var(--premium-gradient)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent'
               }}>{t?.home?.recommendation?.title2}</span>
               <Sparkles size={28} color="var(--gold-600)" />
            </h2>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
               {t?.home?.recommendation?.subtitle}
            </p>
         </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
        gap: '2.5rem', 
        paddingBottom: '2rem' 
      }}>
         {recommendations.map((rec, index) => {
           // Translation logic
           const resultsTable = t?.home?.recommendationResults;
           const sectionsTable = t?.home?.sections;
           
           // Title: use titleKey from recommendationResults table
           const displayTitle = rec.titleKey 
             ? (resultsTable?.[rec.titleKey as keyof typeof resultsTable] || rec.title || rec.titleKey)
             : rec.title;

           // Subtitle: use subtitleKey from sections or a sensible default per category
           let displaySubtitle = rec.subtitle;
           if (!displaySubtitle) {
             const sectionKey = rec.category?.toLowerCase();
             const sectionMap: Record<string, string> = {
               repair: sectionsTable?.repairs?.desc || "Expert structural repairs and installations.",
               cleaning: sectionsTable?.cleaning?.desc || "Professional-grade sanitisation services.",
               accounting: sectionsTable?.accounting?.desc || "HMRC-compliant financial management.",
               auto: sectionsTable?.automotive?.desc || "Vehicle care and diagnostics.",
               home: sectionsTable?.plumbing?.desc || "Home maintenance and systems.",
             };
             displaySubtitle = sectionMap[sectionKey] || t?.home?.recommendation?.subtitle;
           }

           const badgeText = rec.reasonKey === 'assetMatch' 
             ? resultsTable?.assetMatch 
             : resultsTable?.trending;

           return (
             <Link 
               key={rec.id} 
               href={`/services?category=${rec.category}&q=${rec.query}`}
               className={`glass-panel hover-lift reveal active stagger-${(index % 3) + 1}`}
               style={{ 
                 width: '100%', 
                 padding: '2.5rem', 
                 borderRadius: '32px', 
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'space-between',
                 textDecoration: 'none',
                 textAlign: 'inherit',
                 border: '1px solid var(--border-color)',
                 position: 'relative',
                 overflow: 'hidden'
               }}
             >
                {/* Decorative Background Glow */}
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <div style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '18px', 
                        backgroundColor: 'var(--accent-soft)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'var(--gold-600)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.1)'
                      }}>
                         {getCategoryIcon(rec.category)}
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 900, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        color: 'var(--gold-600)', 
                        backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                        padding: '0.4rem 1rem', 
                        borderRadius: '99px',
                        border: '1px solid rgba(212, 175, 55, 0.1)'
                      }}>
                        {badgeText}
                      </span>
                   </div>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                     {displayTitle}
                   </h3>
                   <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                     {displaySubtitle}
                   </p>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row', position: 'relative', zIndex: 1 }}>
                   <div className="btn-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-600)', flexDirection: 'inherit' }}>
                      {t?.home?.recommendation?.browse} <ArrowRight size={16} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                   </div>
                   <div style={{ display: 'flex', gap: '3px' }}>
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="var(--gold-600)" color="var(--gold-600)" />)}
                   </div>
                </div>
             </Link>
           );
         })}
      </div>
    </section>
  );
}
