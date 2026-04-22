"use client";

import { useTranslation } from '@/components/LanguageContext';
import { Star, MapPin, Clock, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface RecProps {
  merchants: {
    topMatch: any;
    risingStar: any;
    bestValue: any;
  };
  query?: string;
  category?: string;
}

export default function SmartRecommendations({ merchants, query, category }: RecProps) {
  const { t, isRTL } = useTranslation();
  
  const items = [
    { data: merchants.topMatch, label: t?.search?.recommendations?.topMatch, icon: <Sparkles size={14} />, color: '#facc15' },
    { data: merchants.risingStar, label: t?.search?.recommendations?.risingStar, icon: <Sparkles size={14} />, color: '#a855f7' },
    { data: merchants.bestValue, label: t?.search?.recommendations?.bestValue, icon: <Zap size={14} />, color: '#10b981' }
  ].filter(item => item.data);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
         <div style={{ 
           width: '48px', 
           height: '48px', 
           borderRadius: '14px', 
           background: 'linear-gradient(135deg, #d4af37 0%, #9a7b2c 100%)',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           boxShadow: '0 8px 16px rgba(212, 175, 55, 0.25)'
         }}>
            <Sparkles size={24} color="#000" fill="#000" />
         </div>
         <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 950, 
              color: '#fff', 
              letterSpacing: '-0.02em',
              marginBottom: '0.25rem'
            }}>
              {t?.search?.recommendations?.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500 }}>
              {t?.search?.recommendations?.subtitle}
            </p>
         </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        {items.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ 
            padding: '2rem', 
            position: 'relative', 
            borderRadius: '24px',
            border: `1px solid ${item.color}40`,
            background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer',
            boxShadow: `0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.5), 0 0 20px ${item.color}22`;
            e.currentTarget.style.borderColor = `${item.color}80`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`;
            e.currentTarget.style.borderColor = `${item.color}40`;
          }}
          >
            {/* Recommendation Tag - Pulsing Effect */}
            <div style={{ 
               position: 'absolute', 
               top: '1.25rem', 
               [isRTL ? 'left' : 'right']: '1.25rem',
               padding: '0.5rem 1rem',
               background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
               color: '#000',
               fontSize: '0.7rem',
               fontWeight: 950,
               borderRadius: '100px',
               display: 'flex',
               alignItems: 'center',
               gap: '6px',
               boxShadow: `0 8px 20px ${item.color}44`,
               textTransform: 'uppercase',
               letterSpacing: '0.05em'
            }}>
               {item.icon} {item.label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
               <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}>
                     <img 
                       src={item.data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.data.id}`} 
                       alt={item.data.companyName} 
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                     />
                  </div>
                  <div style={{ flex: 1 }}>
                     <h3 style={{ 
                       fontSize: '1.15rem', 
                       fontWeight: 900, 
                       color: '#fff', 
                       marginBottom: '0.5rem',
                       lineHeight: 1.2
                     }}>
                       {item.data.companyName}
                     </h3>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '3px', 
                          color: '#facc15', 
                          fontSize: '0.9rem', 
                          fontWeight: 800,
                          background: 'rgba(250, 204, 21, 0.1)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                           <Star size={14} fill="#facc15" /> {item.data.averageRating.toFixed(1)}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>
                          ({item.data.completedJobsCount} {t?.search?.jobsDone || 'jobs'})
                        </span>
                     </div>
                     
                     <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 950, color: '#fff' }}>
                          £{(item.data.basePrice * 1.10).toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#555', fontWeight: 600 }}>
                          / {t?.common?.hr || 'hr'} (inc. 10% fee)
                        </span>
                     </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {item.data.distance !== Infinity && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.8rem', 
                      color: '#aaa',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '100px'
                    }}>
                       <MapPin size={14} /> {item.data.distance.toFixed(1)} miles
                    </div>
                  )}
                  {item.data.isVerified && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.8rem', 
                      color: '#d4af37',
                      background: 'rgba(212, 175, 55, 0.1)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '100px',
                      fontWeight: 700
                    }}>
                       <ShieldCheck size={14} /> {t?.search?.verified}
                    </div>
                  )}
               </div>

               <Link href={`/merchant/${item.data.id}?q=${encodeURIComponent(query || "")}&cat=${encodeURIComponent(category || "")}`} style={{ display: 'block' }}>
                  <button className="btn" style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    fontSize: '0.9rem', 
                    fontWeight: 800,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                  >
                     {t?.search?.recommendations?.viewProfile} <ArrowRight size={18} />
                  </button>
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
