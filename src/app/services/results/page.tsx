"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMerchants, getSmartRecommendations } from '@/app/actions/search';
import { Search, Filter, MapPin, Star, ShieldCheck, ArrowUpDown, Loader2, Navigation as NavIcon, LayoutGrid, Map as MapIcon, Sparkles } from 'lucide-react';
import SmartRecommendations from '@/components/search/SmartRecommendations';
import Link from 'next/link';
import VerifiedBadge from '@/app/components/VerifiedBadge';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import MapView from '@/components/MapView';
import { ALL_UK } from '@/components/LocationContext';

function SearchResults() {
  const searchParams = useSearchParams();
  const { t, format, isRTL } = useTranslation();
  const { city, setCity } = useLocation();
  
  const [results, setResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<{best:any, closest:any, earliest:any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [bounds, setBounds] = useState<{ sw: { lat: number, lng: number }, ne: { lat: number, lng: number } } | undefined>(undefined);
  
  // Filter states
  const [query, setQuery] = useState(searchParams.get('q') || "");
  const [location, setLocation] = useState(searchParams.get('location') || "");
  const [category, setCategory] = useState(searchParams.get('cat') || "All");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'distance' | 'price'>('rating');
  const [isEmergency, setIsEmergency] = useState(false);

  const performSearch = async (overrideLocation?: string, overrideBounds?: any) => {
    setLoading(true);
    try {
      const activeLocation = overrideLocation !== undefined ? overrideLocation : (location || city);
      
      // Update global context if user manually changed sidebar location
      if (activeLocation && activeLocation !== city) {
        setCity(activeLocation);
      } else if (!activeLocation && city !== ALL_UK) {
        setCity(ALL_UK);
      }

      const data = await searchMerchants({
        query,
        category,
        location: activeLocation === ALL_UK || !activeLocation ? undefined : activeLocation,
        minRating,
        isVerified: verifiedOnly,
        sortBy,
        bounds: overrideBounds !== undefined ? overrideBounds : bounds,
        isEmergency
      });
      setResults(data);

      // 🚀 Fetch Smart Recommendations
      if (category && category !== 'All') {
        const recs = await getSmartRecommendations({
          category,
          location: activeLocation === ALL_UK || !activeLocation ? undefined : activeLocation,
          userLat: undefined, // Could get from context if available
          userLon: undefined
        });
        setRecommendations(recs);
      } else {
        setRecommendations(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle initial load and city context synchronization
    const urlLocation = searchParams.get('location');
    const urlCategory = searchParams.get('cat');
    const urlQuery = searchParams.get('q');
    
    // Sync UI state with URL or Context
    if (urlLocation) {
      setLocation(urlLocation);
    } else if (city && !location) {
      setLocation(city === ALL_UK ? "" : city);
    }

    // Perform search once on mount or when city changes
    const activeLocation = urlLocation || (city === ALL_UK ? undefined : city);
    performSearch(activeLocation);
    // Reset bounds when city changes to avoid conflicting with new location search
    setBounds(undefined);
  }, [city]); // Recalculate when city changes from header

  const handleSearchInBounds = (newBounds: any) => {
    setBounds(newBounds);
    performSearch(location || city, newBounds);
  };

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '10rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="search-results-grid mobile-stack" style={{ 
        display: 'flex', 
        gap: '2.5rem',
        flexDirection: isRTL ? 'row-reverse' : 'row'
      }}>
        
        {/* Sidebar Filters */}
        <aside className="glass-panel" style={{ 
          padding: '2rem', 
          borderRadius: '1.5rem', 
          backgroundColor: 'var(--surface-1)', 
          border: '1px solid var(--border-color)', 
          height: 'fit-content',
          flex: '0 0 300px',
          width: 'var(--mobile-sidebar-width, auto)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <Filter size={20} color="var(--accent-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t?.search?.filters || "Filters"}</h2>
          </div>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Keyword Search */}
            <div>
               <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', textAlign: 'inherit' }}>{t?.search?.keyword || "Keyword"}</label>
               <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    placeholder="..." 
                    style={{ width: '100%', padding: `0.75rem ${isRTL ? '2.5rem' : '1rem'} 0.75rem ${isRTL ? '1rem' : '2.5rem'}`, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)', textAlign: 'inherit', outline: 'none' }}
                  />
                  <Search size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
               </div>
            </div>

            {/* Location Search */}
            <div>
               <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', textAlign: 'inherit' }}>{t?.search?.location || "Location"}</label>
               <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                    placeholder="..." 
                    style={{ width: '100%', padding: `0.75rem ${isRTL ? '2.5rem' : '1rem'} 0.75rem ${isRTL ? '1rem' : '2.5rem'}`, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)', textAlign: 'inherit', outline: 'none' }}
                  />
                  <MapPin size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
               </div>
            </div>

            {/* Category Select */}
            <div>
               <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', textAlign: 'inherit' }}>{t?.search?.category || "Specialism"}</label>
                <select 
                 value={category} 
                 onChange={(e) => setCategory(e.target.value)}
                 style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', color: 'var(--text-primary)', textAlign: 'inherit', outline: 'none', cursor: 'pointer' }}
                 >
                   <option value="All">{t?.search?.category || "Specialism"}</option>
                   <option value="Plumbing">{t?.home?.categories?.plumbing || "Plumbing"}</option>
                   <option value="Repairs">{t?.home?.categories?.repairs || "Repairs"}</option>
                   <option value="Renovation">{t?.home?.categories?.renovation || "Renovation"}</option>
                   <option value="Education">{t?.home?.categories?.education || "Education"}</option>
                   <option value="Accounting">{t?.home?.categories?.accounting || "Accounting"}</option>
                   <option value="Legal">{t?.home?.categories?.legal || "Legal"}</option>
                   <option value="Commercial">{t?.home?.categories?.commercial || "Commercial"}</option>
                   <option value="Cleaning">{t?.home?.categories?.cleaning || "Cleaning"}</option>
                 </select>
            </div>

            {/* Min Rating */}
            <div>
               <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', textAlign: 'inherit' }}>{t?.search?.minRating || "Experience Level"}</label>
               <div style={{ display: 'flex', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  {[3, 4, 4.5].map(r => (
                    <button 
                      key={r} 
                      onClick={() => setMinRating(minRating === r ? 0 : r)}
                      style={{ flex: 1, padding: '0.6rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: minRating === r ? 'var(--accent-color)' : 'transparent', color: minRating === r ? 'white' : 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700, transition: '0.2s' }}
                    >
                      {r}+ ⭐
                    </button>
                  ))}
               </div>
            </div>

            {/* Verification Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--accent-soft)', borderRadius: '0.75rem', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }} onClick={() => setVerifiedOnly(!verifiedOnly)}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <ShieldCheck size={18} color="var(--accent-color)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t?.search?.verifiedOnly || "Verified Professionals"}</span>
               </div>
               <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: verifiedOnly ? 'var(--accent-color)' : 'var(--border-color)', position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--surface-1)', position: 'absolute', top: '2px', [isRTL ? 'right' : 'left']: verifiedOnly ? '22px' : '2px', transition: '0.3s' }} />
               </div>
            </div>

            {/* Emergency Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', cursor: 'pointer', border: '1px solid ' + (isEmergency ? 'var(--accent-color)' : 'transparent'), flexDirection: isRTL ? 'row-reverse' : 'row' }} onClick={() => setIsEmergency(!isEmergency)}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <Sparkles size={18} color="var(--accent-color)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--accent-color)' }}>{t?.search?.urgentOnly || "Emergency Rapid Response"}</span>
               </div>
               <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: isEmergency ? 'var(--accent-color)' : 'var(--border-color)', position: 'relative' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--surface-1)', position: 'absolute', top: '2px', [isRTL ? 'right' : 'left']: isEmergency ? '22px' : '2px', transition: '0.3s' }} />
               </div>
            </div>

            <button onClick={() => performSearch()} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {t?.search?.apply || "Apply Optimization"}
            </button>

            {/* AI Diagnosis CTA */}
            <div className="glass-panel" style={{ 
              marginTop: '1.5rem', 
              padding: '1.25rem', 
              background: 'var(--premium-gradient)', 
              borderRadius: '1rem',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                   <Sparkles size={24} />
                </div>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>{t?.home?.aiCTA?.title1 || "Instant AI Analysis"}</h3>
              <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '1rem', lineHeight: 1.4 }}>{t?.home?.aiCTA?.subtitle || "Upload evidence for a rapid technical appraisal"}</p>
              <Link href="/diagnosis">
                <button style={{ 
                  width: '100%', padding: '0.6rem', borderRadius: '0.75rem', 
                  backgroundColor: 'white', color: 'var(--amber-800)', 
                  border: 'none', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' 
                }}>
                  {t.home.aiCTA.button}
                </button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Results Main */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>
                  {loading ? (t?.search?.searching || "Scanning network...") : format(t?.search?.foundCount || "{count} matches found", { count: results.length })}
                </h1>
                
                {/* View Mode Toggle */}
                {!loading && results.length > 0 && (
                  <div style={{ 
                    display: 'flex', backgroundColor: 'var(--surface-2)', 
                    padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' 
                  }}>
                    <button 
                      onClick={() => setViewMode('list')}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', borderRadius: '0.6rem',
                        border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                        backgroundColor: viewMode === 'list' ? 'var(--surface-1)' : 'transparent',
                        color: viewMode === 'list' ? 'var(--accent-color)' : 'var(--text-muted)',
                        boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                        transition: '0.2s'
                      }}
                    >
                      <LayoutGrid size={16} /> {t?.search?.listView || "List"}
                    </button>
                    <button 
                      onClick={() => setViewMode('map')}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', borderRadius: '0.6rem',
                        border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                        backgroundColor: viewMode === 'map' ? 'var(--surface-1)' : 'transparent',
                        color: viewMode === 'map' ? 'var(--accent-color)' : 'var(--text-muted)',
                        boxShadow: viewMode === 'map' ? 'var(--shadow-sm)' : 'none',
                        transition: '0.2s'
                      }}
                    >
                      <MapIcon size={16} /> {t?.search?.mapView || "Map"}
                    </button>
                  </div>
                )}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <ArrowUpDown size={18} style={{ opacity: 0.5 }} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{ backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.2rem 0.5rem', color: 'var(--accent-color)', fontWeight: 700, outline: 'none', cursor: 'pointer', textAlign: 'inherit' }}
                >
                  <option value="rating" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>{t?.search?.sortRating || "Top Rated"}</option>
                  <option value="jobs" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>{t?.search?.sortJobs || "Most Experience"}</option>
                  <option value="distance" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>{t?.search?.sortDistance || "Nearest"}</option>
                  <option value="price" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}>{t?.search?.sortPrice || "Best Value"}</option>
                </select>
             </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', opacity: 0.5 }}>
              <Loader2 className="animate-spin" size={48} />
              <p style={{ marginTop: '1rem' }}>{t?.search?.searching || "Scanning network..."}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '2rem' }}>
              <Search size={40} style={{ color: 'var(--text-secondary)', opacity: 0.5, marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t?.search?.noResults || "No matching experts found"}</h3>
              <button 
                onClick={() => {
                  setCategory("All");
                  setVerifiedOnly(false);
                  setMinRating(0);
                  performSearch();
                }}
                className="btn btn-secondary" 
                style={{ marginTop: '1.5rem' }}
              >
                {t?.search?.clearFilters || "Clear Filters"}
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <MapView merchants={results} onSearchInBounds={handleSearchInBounds} />
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {!loading && recommendations && viewMode === 'list' && (
                <SmartRecommendations merchants={recommendations} />
              )}
              {results.map((merchant: any) => (
                <Link key={merchant.id} href={`/merchant/${merchant.id}`} className="mobile-stack" style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  padding: '1.5rem', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: '1.5rem', 
                  textDecoration: 'none', 
                  color: 'inherit',
                  border: merchant.isAiRecommended ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  boxShadow: merchant.isAiRecommended ? '0 10px 15px -3px var(--accent-soft)' : 'none',
                  transition: 'transform 0.2s',
                  direction: isRTL ? 'rtl' : 'ltr',
                  position: 'relative'
                }}>
                  {merchant.isAiRecommended && (
                    <div style={{ 
                      position: 'absolute', top: '-12px', left: '20px', 
                      backgroundColor: 'var(--accent-color)', color: 'white', padding: '2px 10px', 
                      borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900, 
                      boxShadow: 'var(--shadow-md)', zIndex: 5,
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Sparkles size={10} /> {t?.home?.hero?.aiMatch || "Calculated Match"}
                    </div>
                  )}
                  <div style={{ width: 'var(--mobile-card-img-size, 150px)', flexShrink: 0, aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden' }}>
                    {(() => {
                      const portfolio = merchant.portfolio || [];
                      const avatar = merchant.avatarUrl;
                      const catKey = (merchant.services?.[0]?.category || "default").toLowerCase();
                      const fallback = "https://images.unsplash.com/photo-1581578731548-c744c843509c?q=80&w=400&auto=format&fit=crop";
                      const imgUrl = portfolio.length > 0 ? portfolio[0].imageUrl : (avatar || fallback);
                      return <img src={imgUrl} alt={merchant.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
                    })()}
                  </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: 'inherit' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{merchant.companyName}</h2>
                        {merchant.isVerified && <VerifiedBadge size={16} />}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexDirection: 'inherit' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={14} color="#f59e0b" fill="#f59e0b" />
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{merchant.averageRating.toFixed(1)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} />
                          <span>{merchant.city}</span>
                        </div>
                      </div>
                    </div>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: '0.25rem', minWidth: '120px' }}>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t?.search?.basePrice || "Consultation Fee"}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>£{merchant.basePrice}</div>
                      {merchant.services?.some((s: any) => s.isEmergencyAble) && (
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                          {t?.search?.emergencyReady || "RAPID RESPONSE ACTIVE"}
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{t?.search?.viewDetails || "View Profile"}</div>
                    </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '10rem', textAlign: 'center', color: 'var(--text-muted)' }}>...</div>}>
      <SearchResults />
    </Suspense>
  );
}
