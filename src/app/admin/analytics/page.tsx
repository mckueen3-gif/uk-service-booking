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
  Activity,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

const COLORS = ["#d4af37", "#aa8b2c", "#c5a028", "#8e731f"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{t.admin.stats.syncing || "SYSTEM SYNCING..."}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem' }}
    >
      {/* Infrastructure Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '-1rem' }}>
        <div>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0, opacity: 0.8 }}>
            {t.admin.header.internal}
          </h2>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>
            {t.admin.analytics.gmvTitle}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>{t.admin.header.node}</p>
           <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: 0 }}>LHR-01-SHARD-ALPHA</p>
        </div>
      </div>

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
           trend="+12.4%"
         />
         <MetricBox 
           icon={<Activity size={20} />} 
           label={t.admin.stats.bookings} 
           value={data.summary.count.toString()} 
           sub={t.admin.stats.processed}
           trend="+5.2%"
         />
         <MetricBox 
           icon={<Zap size={20} />} 
           label={t.admin.stats.dailyAvg} 
           value={(data.summary.totalGMV / 30).toFixed(2)} 
           sub={t.admin.stats.volume24h}
           trend="+8.9%"
         />
      </div>

      {/* Main Telemetry Box */}
      <div style={{ 
        padding: '2.5rem', 
        borderRadius: '2rem', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.05), 0 18px 36px -18px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Overlay */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', 
          backgroundSize: '30px 30px', 
          opacity: 0.2, 
          pointerEvents: 'none' 
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '60%' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '1rem', margin: 0 }}>
              <Activity className="animate-pulse" style={{ color: '#d4af37' }} />
              {t.admin.analytics.gmvTitle}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{t.admin.analytics.gmvSub}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#d4af37', boxShadow: '0 0 10px #d4af37' }} />
            {t.admin.analytics.live}
          </div>
        </div>

        <div className="h-[400px] w-full relative z-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={10} 
                fontWeight={700}
                axisLine={false} 
                tickLine={false} 
                tick={{ dy: 10 }}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                fontWeight={700}
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `£${value}`} 
                tick={{ dx: -10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="gmv" 
                stroke="#d4af37" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorGmv)" 
                animationDuration={2500}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#d4af37' }}
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
        <div style={{ padding: '2rem', borderRadius: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
              {t.admin.analytics.sectorDist}
            </h4>
            <Globe size={16} style={{ color: '#94a3b8' }} />
          </div>
          <div style={{ height: '300px', flex: 1 }}>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data.distribution}
                   cx="50%"
                   cy="50%"
                   innerRadius={70}
                   outerRadius={95}
                   paddingAngle={8}
                   dataKey="value"
                   animationBegin={500}
                   animationDuration={1500}
                 >
                   {data.distribution.map((entry: any, index: any) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="none"
                     />
                   ))}
                 </Pie>
                 <Tooltip content={<CustomTooltip />} />
                 <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>{value}</span>}
                 />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Bar Chart */}
        <div style={{ padding: '2rem', borderRadius: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
               {t.admin.analytics.volTitle}
             </h4>
             <ArrowUpRight size={16} style={{ color: '#d4af37' }} />
           </div>
           <div style={{ height: '300px', flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tick={{ dy: 10 }} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tick={{ dx: -10 }} />
                  <Tooltip cursor={{fill: 'rgba(212,175,55,0.05)'}} content={<CustomTooltip />} />
                  <Bar 
                    dataKey="bookings" 
                    fill="#d4af37" 
                    radius={[6, 6, 0, 0]} 
                    barSize={20}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#0f172a', 
        border: '1px solid #d4af37', 
        padding: '12px 16px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        color: '#fff'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label || payload[0].name}
        </p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: p.color || p.fill }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>
              {p.name === 'gmv' ? `£${p.value.toLocaleString()}` : p.value}
            </p>
          </div>
        ))}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={10} style={{ color: '#d4af37' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase' }}>Verified Data Node</span>
        </div>
      </div>
    );
  }
  return null;
}

function MetricBox({ icon, label, value, sub, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ 
        padding: '2rem', 
        borderRadius: '2rem', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '160px'
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', opacity: 0.05, color: '#d4af37' }}>
        {icon}
      </div>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.75rem', margin: 0 }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
          {trend && (
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={14} />
              {trend}
            </span>
          )}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ padding: '4px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
          {icon}
        </div>
        <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>{sub}</p>
      </div>
    </motion.div>
  );
}
