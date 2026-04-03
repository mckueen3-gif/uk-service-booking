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
  Line
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, Calendar, Wallet } from "lucide-react";

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
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      {/* Stats Summary Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
         <MetricBox 
           icon={<Wallet size={20} />} 
           label={t.admin.stats.gmv} 
           value="£128,450" 
           sub={`${t.admin.stats.netRevenue}: £10,276`}
         />
         <MetricBox 
           icon={<Calendar size={20} />} 
           label={t.admin.stats.bookings} 
           value="1,240" 
           sub={t.admin.stats.processed}
         />
         <MetricBox 
           icon={<Users size={20} />} 
           label={t.admin.stats.dailyAvg} 
           value="£4,281" 
           sub={t.admin.stats.volume24h}
         />
      </div>

      {/* Main Stats Area */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Revenue Trend */}
        <div style={{ padding: '2rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', margin: 0 }}>{t.admin.analytics.gmvTitle}</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Distribution Placeholder */}
        <div style={{ padding: '2rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
           <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', margin: 0 }}>{t.admin.analytics.sectorDist}</h3>
           <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <p style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>{t.admin.analytics.live}</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({ icon, label, value, sub }: any) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      borderRadius: '1.5rem', 
      backgroundColor: '#ffffff', 
      border: '1px solid #e2e8f0', 
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.1, color: '#d4af37' }}>
        {icon}
      </div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{sub}</p>
      </div>
    </div>
  );
}
