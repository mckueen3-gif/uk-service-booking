"use client";

import { useEffect, useState } from "react";
import { 
  getMarketplaceStats 
} from "@/app/actions/analytics";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Loader2,
  Activity
} from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionary";

const COLORS = ["#d4af37", "#aa8b2c", "#c5a028", "#8e731f"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

  useEffect(() => {
    async function load() {
      const stats = await getMarketplaceStats(30);
      setData(stats);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#d4af37' }}>
        <Loader2 className="animate-spin mb-4" size={40} />
        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>系統數據同步中...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
         <MetricBox 
           icon={<Wallet size={20} />} 
           label={t.admin.stats.gmv} 
           value={`£${data.summary.totalGMV.toLocaleString()}`} 
           sub={`${t.admin.stats.netRevenue}: £${data.summary.totalRevenue.toLocaleString()}`}
         />
         <MetricBox 
           icon={<Calendar size={20} />} 
           label={t.admin.stats.bookings} 
           value={data.summary.count.toString()} 
           sub={t.admin.stats.processed}
         />
         <MetricBox 
           icon={<Users size={20} />} 
           label={t.admin.stats.dailyAvg} 
           value={(data.summary.totalGMV / 30).toFixed(2)} 
           sub={t.admin.stats.volume24h}
         />
      </div>

      <div style={{ 
        padding: '2rem', 
        borderRadius: '1.5rem', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
              <TrendingUp style={{ color: '#d4af37' }} />
              {t.admin.analytics.gmvTitle}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>{t.admin.analytics.gmvSub}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingLeft: '8px', paddingRight: '8px', paddingTop: '4px', paddingBottom: '4px', backgroundColor: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.admin.analytics.live}
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyTrend}>
              <defs>
                <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="date" stroke="#4a4a4a" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#4a4a4a" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `£${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #d4af37', borderRadius: '12px' }}
                itemStyle={{ color: '#d4af37', fontSize: '12px' }}
                labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="gmv" 
                stroke="#d4af37" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorGmv)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid for Distribution and Volume */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Sector Distribution Pie Chart */}
        <div style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
          <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', margin: 0 }}>{t.admin.analytics.sectorDist}</h4>
          <div style={{ height: '300px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data.distribution}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {data.distribution.map((entry: any, index: any) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                 />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Bar Chart */}
        <div style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
           <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', margin: 0 }}>{t.admin.analytics.volTitle}</h4>
           <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="bookings" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
