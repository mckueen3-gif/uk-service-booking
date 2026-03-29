import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function ResultsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-100 rounded-full"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[400px]">
            <div className="h-48 bg-slate-100"></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded"></div>
                  <div className="h-4 w-24 bg-slate-100 rounded"></div>
                </div>
                <div className="h-8 w-12 bg-blue-50 rounded-lg"></div>
              </div>
              <div className="space-y-2 pt-4">
                <div className="h-4 w-full bg-slate-50 rounded"></div>
                <div className="h-4 w-full bg-slate-50 rounded"></div>
              </div>
              <div className="flex justify-between items-center pt-6">
                <div className="h-6 w-20 bg-slate-100 rounded"></div>
                <div className="h-10 w-28 bg-blue-600 rounded-2xl opacity-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
