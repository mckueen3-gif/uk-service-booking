'use client';

import React, { useEffect, useState } from 'react';
import { getMerchantAnalytics } from '@/app/actions/analytics';
import { TrendingUp, Users, Star, BarChart3, ArrowUpRight, ArrowDownRight, Zap, Target, PieChart } from 'lucide-react';

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
    return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">正在計算您的業績趨勢...</div>;
  }

  if (!data) return null;

  const maxRevenue = Math.max(...data.revenueTrend.map((r: any) => r.revenue)) || 100;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="累計總營收" 
          value={`£${data.performanceMetrics.totalEarnings.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive={true}
          icon={<TrendingUp className="text-emerald-400" />}
        />
        <MetricCard 
          title="預約轉化率" 
          value={`${data.performanceMetrics.conversionRate}%`} 
          trend="+3.2%" 
          isPositive={true}
          icon={<Target className="text-blue-400" />}
        />
        <MetricCard 
          title="回客率" 
          value={`${data.performanceMetrics.repeatCustomerRate}%`} 
          trend="-1.5%" 
          isPositive={false}
          icon={<Users className="text-purple-400" />}
        />
        <MetricCard 
          title="平均評分" 
          value={data.performanceMetrics.averageRating.toFixed(1)} 
          trend="保持穩定" 
          isPositive={true}
          icon={<Star className="text-amber-400" fill="currentColor" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div style={{ backgroundColor: 'var(--surface-1)', backdropFilter: 'blur(16px)', border: '1.5px solid var(--border-color)', borderRadius: '2.5rem', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="var(--accent-color)" /> 近六個月營收趨勢 Revenue
            </h3>
            <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent-color)', borderRadius: '2rem', fontSize: '10px', color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monthly Growth
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '12rem', gap: '1rem', padding: '0 0.5rem' }}>
            {data.revenueTrend.map((month: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <div 
                    style={{ width: '100%', background: 'linear-gradient(to top, var(--accent-color), var(--accent-hover))', borderRadius: '12px 12px 0 0', height: `${(month.revenue / maxRevenue) * 100}%`, minHeight: '4px', transition: 'all 0.7s ease' }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div style={{ backgroundColor: 'var(--surface-1)', backdropFilter: 'blur(16px)', border: '1.5px solid var(--border-color)', borderRadius: '2.5rem', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="var(--accent-color)" /> 顧客滿意度洞察 Insight
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>情緒評分 Sentiment</span>
                <span style={{ color: '#10b981', fontWeight: 900 }}>{data.sentiment.sentimentScore}/100</span>
              </div>
              <div style={{ height: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '2rem', overflow: 'hidden' }}>
                <div 
                  style={{ height: '100%', background: 'linear-gradient(to right, #059669, #10b981)', transition: 'width 1s ease-in-out', width: `${data.sentiment.sentimentScore}%` }}
                ></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>熱門好評關鍵字 Keywords</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.sentiment.positiveKeywords.map((kw: any, i: number) => (
                  <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--accent-soft)', borderRadius: '12px' }}>
                  <Zap size={16} color="var(--accent-color)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                    您的「專業態度」在評價中被提及多次。建議在服務描述中進一步強調您的執照與資歷。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive, icon }: any) {
  return (
    <div style={{ backgroundColor: 'var(--surface-1)', backdropFilter: 'blur(16px)', border: '1.5px solid var(--border-color)', borderRadius: '2rem', padding: '1.5rem', boxShadow: 'var(--shadow-md)', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '14px' }}>
          {icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', fontWeight: 900, padding: '0.25rem 0.5rem', borderRadius: '1rem', border: `1px solid ${isPositive ? '#10b981' : '#ef4444'}`, color: isPositive ? '#10b981' : '#ef4444', backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
          {isPositive ? <ArrowUpRight size={10} style={{ marginRight: '2px' }} /> : <ArrowDownRight size={10} style={{ marginRight: '2px' }} />}
          {trend}
        </div>
      </div>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</p>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</h4>
      </div>
    </div>
  );
}
