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
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c0c0c', borderRadius: '24px', border: '1px solid #222' }}>
        <div style={{ textAlign: 'center' }}>
          <Activity className="animate-spin" size={32} color="#d4af37" />
          <p style={{ marginTop: '1rem', fontWeight: 600, color: '#666' }}>Analyzing your elite performance...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxRevenue = Math.max(...data.revenueTrend.map((r: any) => r.revenue)) || 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: 'transparent' }}>
      {/* KPI Row - Obsidian Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <MetricCard 
          title="Total Earned (Verified)" 
          value={`£${data.performanceMetrics.totalEarnings.toLocaleString()}`} 
          trend="+14.2%" 
          isPositive={true}
          icon={<TrendingUp size={20} color="#d4af37" />}
        />
        <MetricCard 
          title="Booking Conversion" 
          value={`${data.performanceMetrics.conversionRate}%`} 
          trend="+2.1%" 
          isPositive={true}
          icon={<Target size={20} color="#d4af37" />}
        />
        <MetricCard 
          title="Market Rating" 
          value={data.performanceMetrics.averageRating.toFixed(1)} 
          trend="EXCELLENT" 
          isPositive={true}
          icon={<Star size={20} color="#d4af37" fill="#d4af37" />}
        />
        <MetricCard 
          title="Return Customer Rate" 
          value={`${data.performanceMetrics.repeatCustomerRate}%`} 
          trend="-0.5%" 
          isPositive={false}
          icon={<Users size={20} color="#d4af37" />}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Revenue Trend Chart - Gold Bars */}
        <div style={{ padding: '2.5rem', borderRadius: '32px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} color="#d4af37" /> Monthly Revenue Trend
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Last 6 months performance across UK</p>
            </div>
            <div style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', color: '#d4af37', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              AI PREDICTION: BULLISH
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '1rem', padding: '0 0.5rem' }}>
            {data.revenueTrend.map((month: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      background: 'linear-gradient(to top, #d4af37, #fef08a)', 
                      borderRadius: '8px 8px 4px 4px', 
                      height: `${(month.revenue / maxRevenue) * 100}%`, 
                      minHeight: '4px', 
                      transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444' }}>{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sentiment - Gold Metrics */}
        <div style={{ padding: '2.5rem', borderRadius: '32px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="#d4af37" /> Brand Reputation Insights
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#999', fontWeight: 700 }}>Sentiment Mastery Score</span>
                <span style={{ color: '#d4af37', fontWeight: 900 }}>{data.sentiment.sentimentScore}/100</span>
              </div>
              <div style={{ height: '0.75rem', backgroundColor: '#111', borderRadius: '99px', overflow: 'hidden', border: '1px solid #222' }}>
                <div 
                  style={{ height: '100%', background: 'linear-gradient(to right, #d4af37, #fef08a)', transition: 'width 1.5s ease', width: `${data.sentiment.sentimentScore}%`, boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' }}
                ></div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '10px', color: '#555', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>REPUTATION KEYWORDS</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {data.sentiment.positiveKeywords.map((kw: any, i: number) => (
                  <span key={i} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#111', color: '#d4af37', border: '1px solid #222', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
                    #{kw.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '1.25rem', backgroundColor: '#050505', borderRadius: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid #222' }}>
              <div style={{ backgroundColor: '#111', padding: '0.6rem', borderRadius: '12px', border: '1px solid #d4af37' }}>
                <Award size={20} color="#d4af37" />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.5, fontWeight: 500 }}>
                Expertise in <span style={{ color: '#fff', fontWeight: 800 }}>Punctuality</span> detected. Expanding your portfolio could boost lead volume by <span style={{ color: '#d4af37', fontWeight: 800 }}>15%</span> this quarter.
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
    <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.6rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222' }}>
          {icon}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '10px', 
          fontWeight: 900, 
          padding: '0.25rem 0.6rem', 
          borderRadius: '99px', 
          backgroundColor: isPositive ? 'rgba(212, 175, 55, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? '#d4af37' : '#ef4444',
          border: `1px solid ${isPositive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p style={{ color: '#555', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</p>
        <h4 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{value}</h4>
      </div>
    </div>
  );
}
