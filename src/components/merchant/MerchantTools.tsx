'use client';

import React from 'react';
import { 
  Wand2, 
  MessageSquare, 
  Search, 
  Video, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
}

interface MerchantToolsProps {
  t: any;
}

export default function MerchantTools({ t }: MerchantToolsProps) {
  const tools: Tool[] = [
    {
      id: 'diagnosis',
      name: t?.merchant_dashboard?.tools?.diagnosis?.name || "AI Intelligent Diagnosis",
      description: t?.merchant_dashboard?.tools?.diagnosis?.desc || "Visual damage assessment & lead capture system",
      icon: <Wand2 className="w-6 h-6" />,
      badge: t?.merchant_dashboard?.tools?.diagnosis?.badge || "FREE",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      id: 'whatsapp',
      name: t?.merchant_dashboard?.tools?.whatsapp?.name || "WhatsApp Real-time Connect",
      description: t?.merchant_dashboard?.tools?.whatsapp?.desc || "Instant notifications for new leads and queries",
      icon: <MessageSquare className="w-6 h-6" />,
      badge: t?.merchant_dashboard?.tools?.whatsapp?.badge || "FREE",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: 'seo',
      name: t?.merchant_dashboard?.tools?.seo?.name || "SEO Profile Optimization",
      description: t?.merchant_dashboard?.tools?.seo?.desc || "Boost Google rankings & optimize metadata",
      icon: <Search className="w-6 h-6" />,
      badge: t?.merchant_dashboard?.tools?.seo?.badge || "FREE",
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      id: 'video',
      name: t?.merchant_dashboard?.tools?.video?.name || "Elite AI Video Config",
      description: t?.merchant_dashboard?.tools?.video?.desc || "Professional video import & AI knowledge syncing",
      icon: <Video className="w-6 h-6" />,
      badge: t?.merchant_dashboard?.tools?.video?.badge || "FREE",
      color: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            {t?.merchant_dashboard?.tools?.title || "Latest Available Items"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t?.merchant_dashboard?.tools?.subtitle || "Curated growth tools for experts (All FREE)"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Gradient Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-slate-700 dark:text-slate-300">
                    {tool.icon}
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50">
                  {tool.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                {tool.name}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px]">
                {tool.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group/btn transition-colors duration-200">
                {t?.merchant_dashboard?.tools?.launch || "Launch Now"}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
