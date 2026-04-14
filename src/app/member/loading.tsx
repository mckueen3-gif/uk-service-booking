import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-800">Initializing Console...</h2>
        <p className="text-slate-500 max-w-xs mx-auto">Preparing your secure uplink, please stand by.</p>
      </div>
      
      {/* Skeleton placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4 mt-8 opacity-40 select-none pointer-events-none">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-slate-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
