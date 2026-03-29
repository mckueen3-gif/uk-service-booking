'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 md:p-8 pointer-events-none animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-6 md:p-8 pointer-events-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 group overflow-hidden relative">
        {/* Abstract Background Glow */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400/10 blur-[80px] rounded-full group-hover:bg-blue-400/20 transition-all duration-700"></div>
        
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>

        <div className="flex-grow space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            我們重視您的隱私 (We value your privacy)
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            我們使用 Cookie 來優化您的預約體驗並分析站點流量。點擊「接受」即表示您同意我們的 
            <Link href="/legal/cookies" className="text-blue-600 font-semibold hover:underline ml-1">Cookie 政策</Link>。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDecline}
            className="px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors order-2 sm:order-1"
          >
            拒絕 (Decline)
          </button>
          <button 
            onClick={handleAccept}
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-slate-900/20 flex items-center justify-center gap-2 group/btn order-1 sm:order-2"
          >
            全部接受 (Accept All)
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
