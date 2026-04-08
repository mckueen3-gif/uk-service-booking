"use client";

import React, { useMemo } from 'react';
import { MapPin, Star, X, ExternalLink, Zap, Sparkles } from 'lucide-react';
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

  // Helper to map real UK coordinates or generate generic ones
  const mappedMerchants = useMemo(() => {
    if (merchants.length === 0) return [];
    
    // Bounds for London/Nottingham areas generally
    const minLat = 51.0;
    const maxLat = 53.0;
    const minLng = -1.5;
    const maxLng = 0.5;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    return merchants.map((m, idx) => {
      // Use coordinates to determine grid position
      const yStr = m.latitude ? (((m.latitude - minLat) / latRange) * 80) : (20 + (idx % 8) * 8);
      const xStr = m.longitude ? (((m.longitude - minLng) / lngRange) * 80) : (20 + (idx * 13) % 65);
      
      const y = Math.max(10, Math.min(90, 90 - Number(yStr)));
      const x = Math.max(10, Math.min(90, Number(xStr)));
      
      return { ...m, x, y };
    });
  }, [merchants]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'var(--surface-1)', overflow: 'hidden' }}>
      {/* Premium Discovery Background - Architectural Mesh */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: `radial-gradient(var(--border-color) 1px, transparent 1px)`, 
        backgroundSize: '30px 30px', opacity: 0.3 
      }} />
      
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueprintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGrad)" />
        {/* Subtle Path Art */}
        <path d="M -10,50 Q 25,20 50,50 T 110,50" stroke="var(--accent-color)" strokeWidth="0.2" fill="none" opacity="0.2" />
        <path d="M 50,-10 Q 80,25 50,50 T 50,110" stroke="var(--accent-color)" strokeWidth="0.1" fill="none" opacity="0.1" />
      </svg>

      {/* Discovery Mode Header */}
      <div style={{ 
        position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)', color: '#facc15', padding: '6px 16px', borderRadius: '99px',
        fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px',
        border: '1px solid #facc1544', backdropFilter: 'blur(8px)', zIndex: 30, letterSpacing: '0.05em'
      }}>
        <Sparkles size={14} /> CLUSTER DISCOVERY MODE ACTIVE
      </div>

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
            transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Elite Price Bubble */}
          <div style={{ 
            backgroundColor: 'var(--surface-1)', 
            color: 'var(--text-primary)',
            padding: '6px 14px',
            borderRadius: '1rem',
            fontWeight: 900,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-lg)',
            border: `2px solid ${m.isAiRecommended ? 'var(--accent-color)' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : 'var(--border-color)')}`,
            marginBottom: '4px',
            transition: 'all 0.2s',
            transform: selectedMerchant?.id === m.id ? 'translateY(-4px)' : 'none'
          }}>
            £{m.basePrice}
          </div>
          <div style={{ 
            color: m.isAiRecommended ? 'var(--accent-color)' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : 'var(--text-muted)'),
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
          }}>
             <MapPin size={36} fill="currentColor" stroke="var(--surface-1)" strokeWidth={2} />
          </div>
        </button>
      ))}

      {/* Floating Discovery Tag */}
      <div style={{ 
        position: 'absolute', bottom: '24px', right: '24px', 
        padding: '12px', backgroundColor: 'var(--accent-soft)', borderRadius: '16px',
        border: '1px solid var(--accent-color)', color: 'var(--accent-color)',
        fontSize: '0.7rem', fontWeight: 800, maxWidth: '180px', lineHeight: 1.4,
        boxShadow: 'var(--shadow-md)'
      }}>
        <Zap size={14} style={{ marginBottom: '4px' }} />
        Discovery Mode leverages clustered asset data for high-speed location scouting.
      </div>
      
      <style jsx>{`
        .map-pin-btn:hover {
          transform: translate(-50%, -105%) scale(1.1) !important;
          z-index: 50 !important;
        }
        .ai-pulse::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: map-pulse 2s infinite;
          z-index: -1;
        }
        @keyframes map-pulse {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
