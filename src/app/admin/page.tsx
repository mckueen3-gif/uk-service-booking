"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionary";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, Wallet, Zap, ArrowUpRight } from "lucide-react";

const mockData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

export default function AdminDashboard() {
  const t = getDictionary('zh-TW');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      <div style={{ padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>系統概覽</h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>平台即時數據基準與營運指標</p>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem' 
      }}>
         <MetricBox 
           icon={<Wallet size={24} />} 
           label={t.admin.stats.gmv} 
           value="£128,450" 
           sub={`${t.admin.stats.netRevenue}: £10,276`}
           trend="+14.2%"
           accent="#d4af37"
         />
         <MetricBox 
           icon={<Calendar size={24} />} 
           label={t.admin.stats.bookings} 
           value="1,240" 
           sub={t.admin.stats.processed}
           trend="+8.1%"
           accent="#0f172a"
         />
         <MetricBox 
           icon={<TrendingUp size={24} />} 
           label={t.admin.stats.dailyAvg} 
           value="£4,281" 
           sub={t.admin.stats.volume24h}
           trend="+125%"
           accent="#c5a02e"
         />
      </div>

      {/* Main Stats Area */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '2.5rem' 
      }}>
        {/* Revenue Trend */}
        <div style={{ 
          padding: '2.5rem', 
          borderRadius: '2.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(184, 134, 11, 0.08)', 
          boxShadow: '0 30px 70px rgba(0,0,0,0.04)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
                <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>{t.admin.analytics.gmvTitle}</h3>
                <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>營收增長趨勢</p>
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '12px', backgroundColor: '#fafbfc', border: '1px solid #f1f5f9', fontSize: '12px', fontWeight: 800, color: '#64748b' }}>
                過去 7 天
            </div>
          </div>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tick={{ dy: 10 }} />
                <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tick={{ dx: -10 }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', color: '#fff' }}
                    itemStyle={{ color: '#d4af37', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution Placeholder */}
        <div style={{ 
          padding: '2.5rem', 
          borderRadius: '2.5rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid rgba(184, 134, 11, 0.08)', 
          boxShadow: '0 30px 70px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column'
        }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>{t.admin.analytics.sectorDist}</h3>
                    <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>類別市佔分佈</p>
                </div>
                <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.08)', color: '#d4af37' }}>
                    <Zap size={20} />
                </div>
           </div>
           
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '12px solid #fafbfc', borderTopColor: '#d4af37', borderRightColor: '#0f172a', transform: 'rotate(45deg)' }} />
             <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 900 }}>{t.admin.analytics.live}</p>
                <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}>實時數據流對連中...</p>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({ icon, label, value, sub, trend, accent }: any) {
  return (
    <div style={{ 
      padding: '2.5rem', 
      borderRadius: '2.5rem', 
      backgroundColor: '#ffffff', 
      border: '1px solid rgba(184, 134, 11, 0.08)', 
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 30px 70px rgba(0,0,0,0.04)'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '-10px', 
        right: '-10px', 
        width: '100px', 
        height: '100px', 
        background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
        opacity: 0.5
      }} />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ 
                padding: '12px', 
                borderRadius: '16px', 
                backgroundColor: `${accent}10`, 
                color: accent,
                boxShadow: `0 8px 20px ${accent}05`
            }}>
                {icon}
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '12px', fontWeight: 900 }}>
                    <ArrowUpRight size={16} />
                    {trend}
                </div>
            )}
        </div>
        
        <p style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>{value}</p>
        
        <div style={{ height: '1px', width: '40px', backgroundColor: accent, margin: '1.5rem 0 1rem', opacity: 0.3 }} />
        
        <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={12} style={{ opacity: 0.5 }} />
            {sub}
        </p>
      </div>
    </div>
  );
}
