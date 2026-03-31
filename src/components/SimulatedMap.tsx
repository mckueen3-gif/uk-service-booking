"use client";

import React, { useMemo } from 'react';
import { MapPin, Star, X, ExternalLink } from 'lucide-react';
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
  city: string;
  isAiRecommended?: boolean;
  aiScore?: number;
}

interface SimulatedMapProps {
  merchants: Merchant[];
  selectedMerchant: Merchant | null;
  onSelect: (m: Merchant) => void;
  onClose: () => void;
}

export default function SimulatedMap({ merchants, selectedMerchant, onSelect, onClose }: SimulatedMapProps) {
  const { t, isRTL } = useTranslation();

  // Helper to map real coordinates to 10-90% space for visualization
  const mappedMerchants = useMemo(() => {
    if (merchants.length === 0) return [];
    
    // Default bounds covering common UK cities if data is generic
    const minLat = 51.3;
    const maxLat = 51.7;
    const minLng = -0.2;
    const maxLng = 0.2;

    const latRange = maxLat - minLat || 0.1;
    const lngRange = maxLng - minLng || 0.1;

    return merchants.map((m, idx) => {
      // Map coordinates to 10-90% to avoid edge clipping or use random grid spots if coords are missing
      const y = 90 - (( (m.latitude || (minLat + latRange * (0.2 + (idx % 5) / 10))) - minLat) / latRange) * 80;
      const x = 10 + (((m.longitude || (minLng + lngRange * (0.2 + (idx % 7) / 10))) - minLng) / lngRange) * 80;
      
      return { ...m, x, y };
    });
  }, [merchants]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#f8f9fa' }}>
      {/* Blueprint Grid Overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
             <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
        <path d="M 0 60 Q 30 70 50 60 T 100 50" stroke="#aadaff" strokeWidth="4" fill="none" opacity="0.4" />
      </svg>

      {/* Simulated Pins */}
      {mappedMerchants.map(m => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
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
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Price Tag Box */}
          <div style={{ 
            backgroundColor: 'white', 
            color: 'var(--text-primary)',
            padding: '4px 10px',
            borderRadius: '2rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: `1.5px solid ${m.isAiRecommended ? '#fbbc04' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : 'rgba(16, 185, 129, 0.12)')}`,
            marginBottom: '2px'
          }}>
            £{m.basePrice}
          </div>
          <div style={{ color: m.isAiRecommended ? '#fbbc04' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : '#ea4335') }}>
             <MapPin size={32} fill="currentColor" stroke="white" strokeWidth={1.5} />
          </div>
        </button>
      ))}

      {/* Footer Info Badge (Offline Notice - Optional/Subtle) */}
      <div style={{ position: 'absolute', bottom: '12px', [isRTL ? 'left' : 'right']: '12px', opacity: 0.3, fontSize: '0.65rem' }}>
         Simulated Search Discovery Mode
      </div>
    </div>
  );
}
