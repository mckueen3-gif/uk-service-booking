"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getLiveActivities 
} from "@/app/actions/activity";
import { 
  UserPlus, 
  CalendarCheck, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Wallet,
  Activity
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  USER_SIGNUP: <UserPlus size={16} className="text-emerald-500" />,
  NEW_BOOKING: <CalendarCheck size={16} className="text-blue-500" />,
  PAYMENT_SECURE: <TrendingUp size={16} className="text-[#d4af37]" />,
  DISPUTE_OPENED: <ShieldAlert size={16} className="text-red-500" />
};

export function LivePulse() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPulse() {
    try {
      const data = await getLiveActivities(10);
      setActivities(data);
      setLoading(false);
    } catch (e) {
      console.error("Pulse sync error:", e);
    }
  }

  useEffect(() => {
    fetchPulse();
    const interval = setInterval(fetchPulse, 10000); // Pulse every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && activities.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-[#111] rounded-2xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-[#d4af37] animate-pulse" />
          Neural Active Feed
        </h3>
        <div className="flex items-center gap-1.5 text-[8px] font-black text-[#d4af37]/60 uppercase tracking-widest">
           <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-ping"></span>
           Live Stream
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              layout
              key={activity.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl flex items-start gap-4 group hover:border-[#d4af37]/30 transition-all shadow-lg hover:shadow-[#d4af37]/5"
            >
              <div className="p-2.5 rounded-xl bg-[#141414] border border-white/5 shadow-inner">
                {ICON_MAP[activity.type] || <Zap size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-0.5">{activity.title}</p>
                   <span className="text-[9px] text-gray-600 font-bold">{activity.timeAgo}</span>
                </div>
                <p className="text-sm text-gray-200 font-medium truncate group-hover:text-white transition-colors">{activity.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
