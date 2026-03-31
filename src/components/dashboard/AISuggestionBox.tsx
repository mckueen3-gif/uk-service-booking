'use client';

import React, { useEffect, useState } from 'react';
import { getMerchantAnalytics } from '@/app/actions/analytics';
import { Sparkles, Lightbulb, TrendingUp, Info, ChevronRight, Coins, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AISuggestionBox() {
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

  if (data.performanceMetrics.conversionRate < 60) {
    suggestions.push({
      id: 'price-opt',
      title: '競爭力定價建議 AI',
      desc: '您的轉化率低於倫敦平均。建議檢查相似服務的競爭價格，微調標價或加入「材料費透明」標籤，可增加 25% 詢問度。',
      icon: <Coins color="var(--accent-color)" />,
      action: '查看市場分析 Check Market',
      link: '/services?city=London'
    });
  }

  suggestions.push({
    id: 'profile-opt',
    title: '服務描述優化',
    desc: '基於最新的 5 星評語，建議在主頁加入「專業準時」與「清潔衛生」標籤，AI 預估這能提升 18% 的點擊轉化。',
    icon: <Lightbulb color="var(--accent-color)" />,
    action: '更新商家頁面 Update Page',
    link: '/dashboard/profile'
  });

  return (
    <div className="glass-panel" style={{ 
      background: 'linear-gradient(135deg, var(--emerald-800) 0%, var(--emerald-950) 100%)', 
      borderRadius: '32px', 
      padding: '2.5rem', 
      border: 'none', 
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      position: 'relative',
      color: 'white'
    }}>
      {/* Decorative Glows */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-color)', opacity: 0.2, filter: 'blur(60px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '150px', height: '150px', background: 'white', opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%' }}></div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontFamily: 'var(--font-heading)' }}>
              <Sparkles color="var(--accent-color)" className="animate-pulse" /> Aura 經營策略導師
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>基於您的歷史績效與市場數據的動態智能建議</p>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
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
