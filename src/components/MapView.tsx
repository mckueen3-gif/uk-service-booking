"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleMap, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { 
  MapPin, Star, X, ExternalLink, RefreshCw, 
  Navigation as NavIcon, Sparkles, Loader2, AlertCircle, Zap 
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "@/components/LanguageContext";
import { useGoogleMaps, MAP_STYLES } from './GoogleMapProvider';
import SimulatedMap from './SimulatedMap';

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
  isVerified?: boolean;
}

interface MapViewProps {
  merchants: Merchant[];
  onSearchInBounds?: (bounds: { sw: { lat: number, lng: number }, ne: { lat: number, lng: number } }) => void;
}

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const DEFAULT_CENTER = {
  lat: 51.5074, // London
  lng: -0.1278
};

export default function MapView({ merchants, onSearchInBounds }: MapViewProps) {
  const { t, format, isRTL } = useTranslation();
  const { isLoaded, loadError } = useGoogleMaps();
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [forceSimulated, setForceSimulated] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Persistence for Discovery Mode preference
  useEffect(() => {
    const pref = localStorage.getItem('map-discovery-pref');
    if (pref === 'true') {
      setForceSimulated(true);
    }
  }, []);

  const handleDiscoveryToggle = (val: boolean) => {
    setForceSimulated(val);
    localStorage.setItem('map-discovery-pref', val.toString());
  };

  // Detect if Google Maps fails to render correctly (Oops box doesn't call onLoad)
  useEffect(() => {
    if (isLoaded && !map && !forceSimulated) {
      const timer = setTimeout(() => {
        if (!map) {
          console.warn("Google Maps render timeout - triggering Discovery Mode fallback");
          setHasTimedOut(true);
        }
      }, 5000); // 5 second grace period
      return () => clearTimeout(timer);
    }
  }, [isLoaded, map, forceSimulated]);

  // Filter valid coordinates
  const validMerchants = useMemo(() => {
    return merchants.filter(m => m.latitude && m.longitude);
  }, [merchants]);

  // Calculate center of all merchants
  const center = useMemo(() => {
    if (validMerchants.length === 0) return DEFAULT_CENTER;
    
    const lats = validMerchants.map(m => m.latitude as number);
    const lngs = validMerchants.map(m => m.longitude as number);
    
    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
    };
  }, [validMerchants]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Auto-fit bounds if multiple merchants found
    if (validMerchants.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      validMerchants.forEach(m => {
        bounds.extend({ lat: m.latitude!, lng: m.longitude! });
      });
      mapInstance.fitBounds(bounds);
    }
  }, [validMerchants]);

  const handleHandleCameraMove = () => {
    if (onSearchInBounds) {
      setShowSearchButton(true);
    }
  };

  const executeSearchInBounds = () => {
    if (!map || !onSearchInBounds) return;
    
    const bounds = map.getBounds();
    if (!bounds) return;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    onSearchInBounds({
      sw: { lat: sw.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() }
    });
    
    setShowSearchButton(false);
  };

  // Reset search button when merchants update from outside
  useEffect(() => {
    setShowSearchButton(false);
  }, [merchants]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '650px', 
      borderRadius: '2rem', 
      overflow: 'hidden',
      border: '2px solid var(--border-color)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      direction: 'ltr'
    }}>
      {( (!isLoaded || !map) && !forceSimulated && !hasTimedOut && !loadError) ? (
        <div style={{ padding: '5rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-1)' }}>
           <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
           <p style={{ marginTop: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Initializing Orbital Mapping Engine...</p>
        </div>
      ) : (loadError || forceSimulated || hasTimedOut) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <SimulatedMap 
            merchants={validMerchants} 
            selectedMerchant={selectedMerchant}
            onSelect={(m: Merchant) => setSelectedMerchant(m)}
            onClose={() => setSelectedMerchant(null)}
          />
          {(hasTimedOut || loadError) && !forceSimulated && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem', borderRadius: '2rem', backgroundColor: 'var(--surface-1)', border: '2px solid #facc15', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
                <AlertCircle size={48} color="#facc15" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1rem' }}>Map Connectivity Issue</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  The global mapping engine is currently restricted or billing-disabled in this environment.
                </p>
                <button 
                  onClick={() => handleDiscoveryToggle(true)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Sparkles size={18} /> Switch to Discovery Mode
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Map Bypass Toggle - Professional Label */}
          <button 
            onClick={() => handleDiscoveryToggle(true)}
            style={{
              position: 'absolute',
              bottom: '24px',
              [isRTL ? 'right' : 'left']: '24px',
              zIndex: 50,
              padding: '0.6rem 1.25rem',
              borderRadius: '99px',
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid var(--accent-color)',
              color: 'var(--accent-color)',
              fontSize: '0.75rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Zap size={14} /> ⚡ SWITCH TO FAST DISCOVERY MODE
          </button>

          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={center}
            zoom={12}
            onLoad={onMapLoad}
            onDragStart={() => handleHandleCameraMove()}
            onZoomChanged={() => handleHandleCameraMove()}
            options={{
              styles: MAP_STYLES,
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {validMerchants.map(m => (
              <OverlayViewF
                key={m.id}
                position={{ lat: m.latitude!, lng: m.longitude! }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div style={{ transform: 'translate(-50%, -100%)', position: 'absolute' }}>
                  <button
                    onClick={() => setSelectedMerchant(m)}
                    className={`map-pin-btn ${m.isAiRecommended ? 'ai-pulse' : ''}`}
                    style={{
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
                    {/* Premium Price Tag */}
                    <div style={{ 
                      backgroundColor: 'white', 
                      color: 'var(--text-primary)',
                      padding: '4px 12px',
                      borderRadius: '2rem',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: `1.5px solid ${m.isAiRecommended ? '#fbbc04' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : 'rgba(16, 185, 129, 0.1)')}`,
                      marginBottom: '2px',
                      transition: 'all 0.2s',
                      zIndex: 2,
                      whiteSpace: 'nowrap'
                    }}>
                      £{m.basePrice}
                    </div>

                    {/* Professional Pin */}
                    <div style={{ 
                        color: m.isAiRecommended ? '#fbbc04' : (selectedMerchant?.id === m.id ? 'var(--accent-color)' : '#ea4335'),
                        transform: selectedMerchant?.id === m.id ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s'
                    }}>
                        <MapPin size={34} fill="currentColor" stroke="white" strokeWidth={1.5} />
                    </div>
                  </button>
                </div>
              </OverlayViewF>
            ))}
          </GoogleMap>

          {/* Search This Area Button */}
          {showSearchButton && (
            <button
              onClick={executeSearchInBounds}
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--surface-1)',
                color: 'var(--accent-color)',
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                border: '1px solid var(--accent-color)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                zIndex: 40,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-1)';
                e.currentTarget.style.color = 'var(--accent-color)';
              }}
            >
              <RefreshCw size={16} /> {t.search.searchThisArea || 'Search this area'}
            </button>
          )}
        </>
      )}

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
          backdropFilter: 'blur(12px)',
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
                   ✨ AI BEST MATCH
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
      {!selectedMerchant && (
        <div style={{ position: 'absolute', top: '24px', [isRTL ? 'left' : 'right']: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ 
            padding: '0.6rem 1.25rem', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', 
            borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' 
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{format(t.search.foundCount, { count: merchants.length })}</span>
          </div>
        </div>
      )}
      
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
