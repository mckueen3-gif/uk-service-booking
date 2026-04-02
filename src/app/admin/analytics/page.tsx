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
import { TrendingUp, Users, Calendar, Wallet, Loader2 } from "lucide-react";

const COLORS = ["#d4af37", "#aa8b2c", "#c5a028", "#8e731f"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#d4af37]">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Synchronizing Neural Data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricBox 
           icon={<Wallet size={20} />} 
           label="Total GMV (30d)" 
           value={`£${data.summary.totalGMV.toLocaleString()}`} 
           sub={`Net Revenue: £${data.summary.totalRevenue.toLocaleString()}`}
         />
         <MetricBox 
           icon={<Calendar size={20} />} 
           label="Bookings Completed" 
           value={data.summary.count.toString()} 
           sub="Successfully processed"
         />
         <MetricBox 
           icon={<Users size={20} />} 
           label="Daily Average" 
           value={(data.summary.totalGMV / 30).toFixed(2)} 
           sub="Processing volume per 24h"
         />
      </div>

      {/* Main GMV Trend Area Chart */}
      <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#d4af37]/10 transition-colors"></div>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <TrendingUp className="text-[#d4af37]" />
              Gross Merchandise Value (GMV)
            </h3>
            <p className="text-gray-500 text-sm italic">Aggregate booking value trends for the last 30 days.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">
            Live Stream Active
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] shadow-xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Sector Distribution</h4>
          <div className="h-[300px]">
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
                   contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px' }}
                   itemStyle={{ fontSize: '12px' }}
                 />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] shadow-xl">
           <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Booking Volume</h4>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="date" stroke="#4a4a4a" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4a4a4a" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px' }}
                    cursor={{fill: '#1a1a1a'}}
                  />
                  <Bar dataKey="bookings" fill="#aa8b2c" radius={[4, 4, 0, 0]} />
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
    <div className="p-6 rounded-3xl bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#d4af37]/30 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-700 text-[#d4af37]">
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-white group-hover:text-[#d4af37] transition-colors">{value}</p>
        <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase">{sub}</p>
      </div>
    </div>
  );
}
