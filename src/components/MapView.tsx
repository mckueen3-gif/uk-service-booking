"use client";

import React, { useState, useMemo } from 'react';
import { MapPin, Star, X, ExternalLink, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";

interface Merchant {
  id: string;
  companyName: string;
  basePrice: number;
  averageRating: number;
  totalReviews: number;
  latitude?: number;
  longitude?: number;
  isAiRecommended?: boolean;
  aiScore?: number;
}

interface MapViewProps {
  merchants: Merchant[];
}

export default function MapView({ merchants }: MapViewProps) {
  const { t, isRTL } = useTranslation();
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // Helper to map real coordinates to SVG 0-100% space
  const mappedMerchants = useMemo(() => {
    if (merchants.length === 0) return [];
    
    // Find min/max bounds or use a fixed city-center bound
    const lats = merchants.map(m => m.latitude).filter(l => l !== null) as number[];
    const lngs = merchants.map(m => m.longitude).filter(l => l !== null) as number[];
    
    // Default bounds covering common UK cities if data is missing
    const minLat = lats.length > 0 ? Math.min(...lats) - 0.05 : 51.3;
    const maxLat = lats.length > 0 ? Math.max(...lats) + 0.05 : 51.7;
    const minLng = lngs.length > 0 ? Math.min(...lngs) - 0.05 : -0.2;
    const maxLng = lngs.length > 0 ? Math.max(...lngs) + 0.05 : 0.2;

    const latRange = maxLat - minLat || 0.1;
    const lngRange = maxLng - minLng || 0.1;

    return merchants.map((m, idx) => {
      // Map coordinates to 10-90% to avoid edge clipping
      const y = 90 - (( (m.latitude || (minLat + latRange * (0.2 + (idx % 5) / 10))) - minLat) / latRange) * 80;
      const x = 10 + (((m.longitude || (minLng + lngRange * (0.2 + (idx % 7) / 10))) - minLng) / lngRange) * 80;
      
      return { ...m, x, y };
    });
  }, [merchants]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '650px', 
      backgroundColor: 'var(--surface-1)', 
      borderRadius: '2rem', 
      overflow: 'hidden',
      border: '2px solid var(--border-color)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      direction: 'ltr' // Always LTR for the coordinate system
    }}>
      {/* Google Style Map Background */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundColor: '#f8f9fa' // Google Land Color
      }} />
      
      {/* Simulated Road Grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="roadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
             <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#roadGrid)" />
        
        {/* River (Thames-like) */}
        <path d="M 0 60 Q 30 70 50 60 T 100 50" stroke="#aadaff" strokeWidth="8" fill="none" opacity="0.8" />
        
        {/* Parks */}
        <rect x="10" y="10" width="15" height="15" fill="#e6f4ea" rx="2" />
        <rect x="70" y="20" width="20" height="10" fill="#e6f4ea" rx="2" />
        <circle cx="40" cy="30" r="5" fill="#e6f4ea" />
      </svg>

      {/* Pins */}
      {mappedMerchants.map(m => (
        <button
          key={m.id}
          onClick={() => setSelectedMerchant(m)}
          className={`map-pin-btn ${m.isAiRecommended ? 'ai-pulse' : ''}`}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: 'translate(-50%, -100%)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: m.isAiRecommended ? 25 : (selectedMerchant?.id === m.id ? 20 : 10),
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
        >
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Price Tag (Google Style) */}
            <div style={{ 
              backgroundColor: 'white', 
              color: 'var(--text-primary)',
              padding: '4px 10px',
              borderRadius: '2rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: `1px solid var(--border-color)`,
              marginBottom: '2px',
              transition: 'all 0.2s',
              zIndex: 2
            }}>
              £{m.basePrice}
            </div>

            {/* Pin Icon */}
            <div style={{ 
                color: m.isAiRecommended ? '#fbbc04' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : '#ea4335'),
                transform: selectedMerchant?.id === m.id ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s'
            }}>
                <MapPin size={32} fill="currentColor" stroke="white" strokeWidth={1.5} />
            </div>
          </div>
        </button>
      ))}

      {/* Info Card Overlay */}
      {selectedMerchant && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
          backgroundColor: 'var(--surface-1)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          overflow: 'hidden',
          zIndex: 30,
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          direction: isRTL ? 'rtl' : 'ltr'
        }}>
          <div style={{ width: '120px', height: '140px', backgroundColor: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <MapPin size={40} color="var(--accent-color)" opacity="0.3" />
          </div>
          <div style={{ padding: '1.25rem', flex: 1, position: 'relative', textAlign: 'inherit' }}>
            <button 
              onClick={() => setSelectedMerchant(null)}
              style={{ position: 'absolute', top: '10px', [isRTL ? 'left' : 'right']: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {selectedMerchant.companyName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <strong style={{ color: 'var(--text-primary)' }}>{selectedMerchant.averageRating.toFixed(1)}</strong> ({selectedMerchant.totalReviews})
              </div>
              {selectedMerchant.isAiRecommended && (
                <span style={{ 
                    backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #fde68a'
                }}>
                   ✨ AI 最佳匹配 (Best Match)
                </span>
              )}
            </div>
            <Link href={`/merchant/${selectedMerchant.id}`} style={{ textDecoration: 'none' }}>
              <button style={{ 
                width: '100%', 
                backgroundColor: 'var(--accent-color)', 
                color: 'white', 
                padding: '0.75rem', 
                borderRadius: '0.75rem', 
                border: 'none', 
                fontSize: '0.95rem', 
                fontWeight: 800, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}>
                {t.search.viewDetails} <ExternalLink size={16} />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Map Tooltips */}
      <div style={{ position: 'absolute', top: '24px', [isRTL ? 'left' : 'right']: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ 
          padding: '0.6rem 1.25rem', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', 
          borderRadius: '1rem', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '8px' 
        }}>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />
           <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{merchants.length} {t.search.foundCount}</span>
        </div>
      </div>
      
      {/* Style Overrides and Animations */}
      <style jsx>{`
        .map-pin-btn:hover {
          transform: translate(-50%, -105%) scale(1.1) !important;
        }
        .ai-pulse::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40px;
          height: 40px;
          background: rgba(251, 188, 4, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          z-index: -1;
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
