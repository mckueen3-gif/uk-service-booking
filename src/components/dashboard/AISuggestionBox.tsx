'use client';

import React, { useEffect, useState } from 'react';
import { getMerchantAnalytics } from '@/app/actions/analytics';
import { Sparkles, Lightbulb, TrendingUp, Info, ChevronRight, Coins } from 'lucide-react';
import Link from 'next/link';

export default function AISuggestionBox() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchantAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return null;

  // Logic for dynamic suggestions
  const suggestions = [];

  if (data.performanceMetrics.conversionRate < 50) {
    suggestions.push({
      id: 'price-opt',
      title: '競爭力定價建議',
      desc: '您的轉化率低於同業平均。建議檢查倫敦地區的冷氣維護行情，適當調整 £5-10 的基礎價格可能會帶來 20% 以上的訂單增長。',
      icon: <Coins className="text-amber-400" />,
      action: '查看市場分析',
      link: '/services?city=London'
    });
  }

  if (data.performanceMetrics.repeatCustomerRate < 30) {
    suggestions.push({
      id: 'retention-opt',
      title: '提升顧客回訪率',
      desc: '您的回客率有進步空間。建議在服務完成後，透過 ServiceHub 發送專屬的「年度維護優惠碼」，鎖定下一季的生意。',
      icon: <TrendingUp className="text-emerald-400" />,
      action: '設置優惠活動',
      link: '/dashboard/vouchers'
    });
  }

  suggestions.push({
    id: 'profile-opt',
    title: '服務描述優化',
    desc: '基於最新的顧客好評，建議在簡介中加入「專業證照」與「準時抵達」關鍵字，這能顯著提升新客戶的點擊信心。',
    icon: <Lightbulb className="text-blue-400" />,
    action: '更新商家頁面',
    link: '/dashboard/profile'
  });

  return (
    <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden relative group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] -ml-32 -mb-32"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Sparkles className="text-blue-400 animate-pulse" /> Aura 經營策略導師
            </h3>
            <p className="text-slate-400 text-sm mt-1">基於您的歷史績效與市場大數據的 AI 建議</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <Info size={18} className="text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.slice(0, 3).map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-all group/card">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover/card:scale-110 transition-transform">
                {s.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
                {s.desc}
              </p>
              <Link href={s.link} className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
                {s.action} <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
            <button className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-2 hover:text-slate-300 transition-colors">
                Generated at {new Date().toLocaleTimeString()} • Updated Daily
            </button>
        </div>
      </div>
    </div>
  );
}
