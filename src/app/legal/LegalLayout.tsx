import React from 'react';

export default function LegalLayout({ 
  title, 
  lastUpdated, 
  children 
}: { 
  title: string; 
  lastUpdated: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-slate-500 font-medium">
              Last Updated: {lastUpdated}
            </p>
          </div>
          
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600 prose-strong:text-slate-900
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            marker:text-blue-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
