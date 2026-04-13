"use client";

import { useTranslation } from '@/components/LanguageContext';
import { Star, MapPin, Clock, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface RecProps {
  merchants: {
    best: any;
    closest: any;
    earliest: any;
  };
}

export default function SmartRecommendations({ merchants }: RecProps) {
  const { t, isRTL } = useTranslation();
  
  const items = [
    { data: merchants.best, label: t.search.recommendations.topMatch, icon: <Sparkles size={14} />, color: '#facc15' },
    { data: merchants.closest, label: t.search.recommendations.closest, icon: <MapPin size={14} />, color: '#60a5fa' },
    { data: merchants.earliest, label: t.search.recommendations.earliest, icon: <Clock size={14} />, color: '#10b981' }
  ].filter(item => item.data);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
         <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}>
            <Zap size={20} fill="#d4af37" />
         </div>
         <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>{t.search.recommendations.title}</h2>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{t.search.recommendations.subtitle}</p>
         </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        {items.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ 
            padding: '1.5rem', 
            position: 'relative', 
            border: `1px solid ${item.color}33`,
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Recommendation Tag */}
            <div style={{ 
               position: 'absolute', 
               top: '0', 
               [isRTL ? 'left' : 'right']: '0',
               padding: '0.4rem 0.8rem',
               background: item.color,
               color: '#000',
               fontSize: '0.65rem',
               fontWeight: 950,
               borderBottomLeftRadius: isRTL ? '0' : '12px',
               borderBottomRightRadius: isRTL ? '12px' : '0',
               display: 'flex',
               alignItems: 'center',
               gap: '4px',
               boxShadow: `0 4px 12px ${item.color}44`
            }}>
               {item.icon} {item.label.toUpperCase()}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                  <img src={item.data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.data.id}`} alt={item.data.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{item.data.companyName}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#facc15', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Star size={12} fill="#facc15" /> {item.data.averageRating.toFixed(1)}
                     </div>
                     <span style={{ fontSize: '0.75rem', color: '#666' }}>({item.data.completedJobsCount} {t.merchant.realReviews})</span>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
               {item.data.distance !== Infinity && (
                 <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {item.data.distance.toFixed(1)} miles
                 </span>
               )}
               {item.data.isVerified && (
                 <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d4af37' }}>
                    <ShieldCheck size={12} /> {t.search.verified}
                 </span>
               )}
            </div>

            <Link href={`/merchant/${item.data.id}`} style={{ display: 'block', marginTop: '1.25rem' }}>
               <button className="btn" style={{ 
                 width: '100%', 
                 padding: '0.75rem', 
                 fontSize: '0.85rem', 
                 background: 'rgba(255,255,255,0.03)',
                 color: '#fff',
                 border: '1px solid rgba(255,255,255,0.1)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '0.5rem'
               }}>
                  {t.search.recommendations.viewProfile} <ArrowRight size={14} />
               </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
