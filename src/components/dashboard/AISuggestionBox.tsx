'use client';

import React, { useEffect, useState } from 'react';
import { getMerchantAnalytics } from '@/app/actions/analytics';
import { Sparkles, Lightbulb, TrendingUp, Info, ChevronRight, Coins, Zap } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";

export default function AISuggestionBox() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return null;

  const suggestions = [];

  const convRate = data?.performanceMetrics?.conversionRate || 0;
  if (convRate < 60) {
    suggestions.push({
      id: 'price-opt',
      title: t?.merchant?.ai?.pricing?.title || 'Competitive Pricing AI',
      desc: t?.merchant?.ai?.pricing?.desc || 'Your conversion rate is below the regional average. AI suggests adjusting price points or adding material transparency labels.',
      icon: <Coins color="var(--accent-color)" />,
      action: t?.merchant?.ai?.pricing?.cta || 'Check Market',
      link: '/services/results'
    });
  }

  suggestions.push({
    id: 'profile-opt',
    title: t?.merchant?.ai?.profile?.title || 'Profile Intelligence',
    desc: t?.merchant?.ai?.profile?.desc || 'Based on recent 5-star reviews, adding "Professional" and "Hygienic" tags could boost click-through by 18%.',
    icon: <Lightbulb color="var(--accent-color)" />,
    action: t?.merchant?.ai?.profile?.cta || 'Update Page',
    link: '/dashboard/profile'
  });

  return (
    <div className="glass-panel" style={{ 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', 
      borderRadius: '32px', 
      padding: '2.5rem', 
      border: '1px solid rgba(212, 175, 55, 0.3)', 
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      position: 'relative',
      color: 'white'
    }}>
      {/* Decorative Glows */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-color)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%' }}></div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
              <Sparkles color="var(--accent-color)" className="animate-pulse" /> {t?.merchant?.ai?.title || "Aura Strategy Mentor"}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {t?.merchant?.ai?.subtitle || "Dynamic logic based on historical performance and mesh telemetry."}
            </p>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Zap size={20} color="var(--accent-color)" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {suggestions.slice(0, 2).map((s) => (
            <div key={s.id} style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '24px', 
              padding: '1.5rem',
              transition: 'all 0.3s'
            }} className="hover-lift">
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'white', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
                   {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{s.desc}</p>
                  <Link href={s.link} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
                    {s.action} <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Generated at {new Date().toLocaleTimeString()} • AI Sync Active
          </p>
        </div>
      </div>
    </div>
  );
}
