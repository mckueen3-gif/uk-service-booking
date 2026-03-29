"use client";

import { Search } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";

export default function NavbarSearch() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="search-nav" style={{ flex: 1, maxWidth: '400px', position: 'relative', direction: isRTL ? 'rtl' : 'ltr' }}>
      <input 
        type="text" 
        placeholder={t.search.keyword + "..."} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            window.location.href = `/services/results?q=${encodeURIComponent(e.currentTarget.value)}`;
          }
        }}
        style={{ 
          width: '100%', 
          padding: isRTL ? '0.6rem 2.8rem 0.6rem 1rem' : '0.6rem 1rem 0.6rem 2.8rem', 
          backgroundColor: 'var(--surface-1)', 
          border: '1.5px solid var(--border-color)', 
          borderRadius: '2rem',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontWeight: 600,
          outline: 'none'
        }} 
      />
      <i style={{ 
        position: 'absolute', 
        left: isRTL ? 'auto' : '1rem', 
        right: isRTL ? '1rem' : 'auto',
        top: '50%', 
        transform: 'translateY(-50%)', 
        opacity: 1, 
        color: 'var(--text-primary)' 
      }}>
        <Search size={18} />
      </i>
    </div>
  );
}
