'use client';

import React, { useEffect, useState } from 'react';
import { getMerchantAnalytics } from '@/app/actions/analytics';
import { TrendingUp, Users, Star, BarChart3, ArrowUpRight, ArrowDownRight, Zap, Target, PieChart, Activity, Award } from 'lucide-react';

export default function MerchantAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center' }}>
          <Activity className="animate-spin" size={32} color="var(--accent-color)" />
          <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>正在分析您的業務數據...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxRevenue = Math.max(...data.revenueTrend.map((r: any) => r.revenue)) || 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard 
          title="總計實收 Total Earned" 
          value={`£${data.performanceMetrics.totalEarnings.toLocaleString()}`} 
          trend="+14.2%" 
          isPositive={true}
          icon={<TrendingUp size={20} color="var(--amber-600)" />}
        />
        <MetricCard 
          title="預約轉化 Conversion" 
          value={`${data.performanceMetrics.conversionRate}%`} 
          trend="+2.1%" 
          isPositive={true}
          icon={<Target size={20} color="#3b82f6" />}
        />
        <MetricCard 
          title="市場評分 Rating" 
          value={data.performanceMetrics.averageRating.toFixed(1)} 
          trend="卓越" 
          isPositive={true}
          icon={<Star size={20} color="#f59e0b" fill="#f59e0b" />}
        />
        <MetricCard 
          title="回客意願 Retention" 
          value={`${data.performanceMetrics.repeatCustomerRate}%`} 
          trend="-0.5%" 
          isPositive={false}
          icon={<Users size={20} color="#8b5cf6" />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Revenue Trend Chart */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} color="var(--accent-color)" /> 每月營收趨勢 Revenue
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>過去六個月的完工金額統計</p>
            </div>
            <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--amber-50)', borderRadius: '10px', color: 'var(--amber-700)', fontSize: '0.75rem', fontWeight: 800 }}>
              AI 預測看漲
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '1rem', padding: '0 0.5rem' }}>
            {data.revenueTrend.map((month: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      background: 'linear-gradient(to top, var(--amber-600), var(--amber-400))', 
                      borderRadius: '8px 8px 4px 4px', 
                      height: `${(month.revenue / maxRevenue) * 100}%`, 
                      minHeight: '4px', 
                      transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.1)'
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sentiment & Skills */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', background: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="var(--accent-color)" /> 客戶口碑洞察 Sentiment
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>品牌滿意度分數</span>
                <span style={{ color: 'var(--amber-600)', fontWeight: 900 }}>{data.sentiment.sentimentScore}/100</span>
              </div>
              <div style={{ height: '0.75rem', backgroundColor: 'var(--surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', background: 'linear-gradient(to right, var(--amber-600), var(--amber-400))', transition: 'width 1.5s ease', width: `${data.sentiment.sentimentScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>熱門好評關鍵字</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.sentiment.positiveKeywords.map((kw: any, i: number) => (
                  <span key={i} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--amber-50)', color: 'var(--amber-700)', border: '1px solid var(--amber-100)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1.25rem', backgroundColor: 'var(--surface-2)', borderRadius: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
                <Award size={20} color="var(--accent-color)" />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                您的「準時」與「專業」提及度極高。建議更新作品集照片，這有助於再提升 <span style={{ fontWeight: 800 }}>15%</span> 的點擊率。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive, icon }: any) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'white', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.6rem', backgroundColor: 'var(--surface-2)', borderRadius: '12px' }}>
          {icon}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '10px', 
          fontWeight: 900, 
          padding: '0.25rem 0.6rem', 
          borderRadius: '99px', 
          backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? '#d4af37' : '#dc2626'
        }}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</p>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</h4>
      </div>
    </div>
  );
}
