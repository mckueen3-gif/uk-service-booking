'use client';

import React from 'react';
import { Share2, Globe, Heart } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";

interface ProfileActionsProps {
  displayName: string;
  description?: string;
  website?: string;
}

export default function ProfileActions({ displayName, description, website }: ProfileActionsProps) {
  const { t } = useTranslation();
  
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: displayName,
        text: description || '',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t.merchant_public?.link_copied || 'Link Copied');
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
      <button 
        onClick={handleShare}
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", border: "1px solid var(--border-color)", background: "var(--surface-1)", color: "var(--text-primary)", borderRadius: "8px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s ease" }}
      >
        <Share2 size={14} /> {t.merchant_public?.share || "Share"}
      </button>
      {website && (
        <a 
          href={website.startsWith('http') ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", border: "1px solid var(--border-color)", background: "var(--surface-1)", color: "var(--text-primary)", borderRadius: "8px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s ease", textDecoration: "none" }}
        >
          <Globe size={14} /> {t.merchant_public?.website || "Website"}
        </a>
      )}
      <button 
        onClick={() => alert(t.merchant_public?.added_favorites || 'Added to Favorites')}
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", border: "1px solid var(--border-color)", background: "var(--surface-1)", color: "var(--text-primary)", borderRadius: "8px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s ease" }}
      >
        <Heart size={14} /> {t.merchant_public?.save || "Save"}
      </button>
    </div>
  );
}
