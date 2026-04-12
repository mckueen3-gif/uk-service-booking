"use client";

import { Search } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";

export default function NavbarSearch() {
  const { t, isRTL } = useTranslation();

  return (
    <div className="search-nav" style={{ flex: 1, maxWidth: '200px', position: 'relative', direction: isRTL ? 'rtl' : 'ltr' }}>
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
          padding: isRTL ? '0.5rem 2.2rem 0.5rem 0.75rem' : '0.5rem 0.75rem 0.5rem 2.2rem', 
          backgroundColor: 'var(--surface-1)', 
          border: '1.5px solid var(--border-color)', 
          borderRadius: '2rem',
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          outline: 'none',
          transition: 'all 0.3s ease'
        }} 
      />
      <i style={{ 
        position: 'absolute', 
        left: isRTL ? 'auto' : '0.8rem', 
        right: isRTL ? '0.8rem' : 'auto',
        top: '50%', 
        transform: 'translateY(-50%)', 
        opacity: 0.8, 
        color: '#d4af37' 
      }}>
        <Search size={14} />
      </i>
    </div>
  );
}
