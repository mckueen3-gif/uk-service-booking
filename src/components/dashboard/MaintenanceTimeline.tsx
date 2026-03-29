'use client';

import React, { useEffect, useState } from 'react';
import { getMaintenanceTimeline, MaintenanceEvent } from '@/app/actions/maintenance';
import { Calendar, Car, Home, AlertTriangle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MaintenanceTimeline() {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenanceTimeline().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-2xl animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] p-12 border border-dashed border-white/10 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-slate-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white">暫無維護排程</h3>
        <p className="text-slate-400 mt-2">新增您的車輛或房產資訊，Aura 將為您規劃智能維護時間軸。</p>
        <Link href="/dashboard/profile/assets" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all text-sm">
          前往管理資產
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            維護時間軸 <span className="text-blue-400">Timeline</span>
          </h3>
          <p className="text-slate-400 text-sm mt-1">Aura 根據您的資產預測的保養需求</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold">
          <Sparkles size={12} /> AI Predicted
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-blue-500 before:via-white/10 before:to-transparent">
        {events.map((event) => (
          <div key={event.id} className="relative flex items-start gap-6 group">
            {/* Icon Node */}
            <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#0f172a] shadow-lg z-10 transition-transform group-hover:scale-110 ${
              event.status === 'OVERDUE' ? 'bg-red-500 text-white' :
              event.status === 'DUE_SOON' ? 'bg-orange-500 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {event.category === 'Automotive' ? <Car size={18} /> : <Home size={18} />}
            </div>

            {/* Content Card */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg tracking-tight">{event.title}</span>
                  {event.status === 'OVERDUE' && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-lg flex items-center gap-1 border border-red-500/20">
                      <AlertTriangle size={10} /> 逾期 Overdue
                    </span>
                  )}
                  {event.status === 'DUE_SOON' && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-black rounded-lg flex items-center gap-1 border border-orange-500/20">
                      <Clock size={10} /> 即將到期
                    </span>
                  )}
                </div>
                <div className="text-slate-500 text-xs font-medium flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(event.dueDate)}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-200">{event.assetName}</p>
                    <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                  </div>
                  <Link 
                    href={`/services/results?category=${event.category}&assetId=${event.assetId}`}
                    className="flex items-center justify-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all group/btn"
                  >
                    立即預約 <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aura Insight Box */}
      <div className="mt-10 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2rem] border border-white/10 relative overflow-hidden group">
        <Sparkles className="absolute -right-4 -top-4 text-white/5 w-24 h-24 rotate-12 group-hover:scale-125 transition-transform" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 backdrop-blur-md flex items-center justify-center border border-blue-500/30 shrink-0">
            <Sparkles size={24} className="text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-white leading-tight mb-1">Aura 的智能建議</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              您的維修排程是基於資產資料與 UK 標準生成的。提前預約可避免高峰期排隊，並確保您的資產始終保持最佳價值。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
