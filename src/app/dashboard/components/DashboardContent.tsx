"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Wallet, 
  Settings, 
  ShieldCheck, 
  Clock,
  Zap,
  TrendingUp,
  PieChart,
  MessageSquare,
  CheckCircle,
  Loader2
} from "lucide-react";
import Link from 'next/link';

function StatCard({ icon, title, value, trend, loading }: { icon: any, title: string, value: string | number, trend?: string, loading?: boolean }) {
  return (
    <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--accent-color)', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
          {icon}
        </div>
        {trend && !loading && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
      ) : (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</h3>
      )}
    </div>
  );
}

export default function DashboardContent({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    // If we have initial data (from server), we still refresh in background silently
    // This is the SWR pattern: Stale-While-Revalidate
    async function refreshData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (e) {
        console.error("Silent background refresh failed", e);
      } finally {
        setLoading(false);
      }
    }
    
    refreshData();
  }, []);

  const { user, isMerchant, merchantData, bookings } = data || {};

  return (
    <div className="animate-fade-up">
      {/* 🚀 INSTANT RENDERING: Shell is always visible */}
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {isMerchant ? (
          <>
            <StatCard 
              title="總收入" 
              value={`£${(merchantData?.wallet?.totalEarned || 0).toFixed(2)}`}
              icon={<Wallet size={24} />}
              trend="+12% 較上月"
              loading={loading && !data}
            />
            <StatCard 
              title="待結算款項" 
              value={`£${(merchantData?.wallet?.pendingBalance || 0).toFixed(2)}`}
              icon={<Clock size={24} />}
              loading={loading && !data}
            />
            <StatCard 
              title="已完成訂單" 
              value={(bookings || []).filter((b: any) => b.status === "COMPLETED").length}
              icon={<CheckCircle size={24} />}
              loading={loading && !data}
            />
          </>
        ) : (
          <>
            <StatCard 
              title="進行中預約" 
              value={(bookings || []).filter((b: any) => b.status === "PENDING" || b.status === "CONFIRMED").length}
              icon={<Calendar size={24} />}
              trend="本週有新進度"
              loading={loading && !data}
            />
            <StatCard 
              title="帳戶餘額" 
              value="£42.50"
              icon={<TrendingUp size={24} />}
              loading={loading && !data}
            />
            <StatCard 
              title="訊息" 
              value="3"
              icon={<MessageSquare size={24} />}
              loading={loading && !data}
            />
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>近期預約狀態</h2>
          <Link href="/dashboard/bookings" style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            查看全部 →
          </Link>
        </div>
        
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {loading && !bookings ? (
            [1,2,3].map(i => (
              <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
            ))
          ) : (bookings && bookings.length > 0) ? bookings.map((booking: any) => (
            <div key={booking.id} style={{ 
              padding: '1.25rem', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{booking.service?.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(booking.scheduledDate).toLocaleString('zh-HK')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>£{booking.totalAmount.toFixed(2)}</div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '2rem',
                  backgroundColor: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: booking.status === 'CONFIRMED' ? '#10b981' : '#f59e0b'
                }}>
                  {booking.status}
                </span>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              目前沒有預約記錄。
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
