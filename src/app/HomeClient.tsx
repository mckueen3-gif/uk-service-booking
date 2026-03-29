"use client";

import { useState, useEffect } from 'react';
import { 
  Search, Wrench, PenTool, Droplets, Sparkles, Briefcase, GraduationCap, Scale, Calculator,
  ChevronRight, ChevronLeft, Star, CheckCircle2, MapPin, Navigation, Car, Loader2
} from 'lucide-react';
import Link from 'next/link';
import SearchHero from '@/components/search/SearchHero';
import RecommendationEngine from '@/components/discovery/RecommendationEngine';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import { searchMerchants } from '@/app/actions/search';

export default function HomeClient() {
  const { t, isRTL } = useTranslation();
  const { city } = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getIcons = () => [
    { id: 'plumbing', label: t.home.categories.plumbing, icon: <Droplets size={28} strokeWidth={1.5} />, category: 'Plumbing' },
    { id: 'repairs', label: t.home.categories.repairs, icon: <Wrench size={28} strokeWidth={1.5} />, category: 'Repair' },
    { id: 'renovation', label: t.home.categories.renovation, icon: <PenTool size={28} strokeWidth={1.5} />, category: 'Home' },
    { id: 'education', label: t.home.categories.education, icon: <GraduationCap size={28} strokeWidth={1.5} />, category: 'Education' },
    { id: 'accounting', label: t.home.categories.accounting, icon: <Calculator size={28} strokeWidth={1.5} />, category: 'Accounting' },
    { id: 'legal', label: t.home.categories.legal, icon: <Scale size={28} strokeWidth={1.5} />, category: 'Legal' },
    { id: 'commercial', label: t.home.categories.commercial, icon: <Briefcase size={28} strokeWidth={1.5} />, category: 'Commercial' },
    { id: 'cleaning', label: t.home.categories.cleaning, icon: <Sparkles size={28} strokeWidth={1.5} />, category: 'Cleaning' },
    { id: 'car', label: t.home.categories.car, icon: <Car size={28} strokeWidth={1.5} />, category: 'Auto' },
  ];

  useEffect(() => {
    async function fetchLocalMerchants() {
      setLoading(true);
      try {
        const selectedCategory = getIcons().find(i => i.id === activeTab)?.category;
        const results = await searchMerchants({
          location: city === t.home.allUK ? undefined : city,
          category: activeTab === 'all' ? undefined : selectedCategory,
          sortBy: 'rating'
        });
        setMerchants(results.slice(0, 8)); // Show top 8
      } catch (err) {
        console.error("Failed to fetch merchants:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLocalMerchants();
  }, [city, activeTab]);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
      
      <SearchHero />

      <div className="container" style={{ maxWidth: '1000px', marginTop: '-2rem', position: 'relative', zIndex: 5 }}>
        <RecommendationEngine />
      </div>

      {/* Directory Navigation */}
      <section className="container" style={{ maxWidth: '1000px', paddingBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: '2rem',
          padding: '2rem 0'
        }}>
          {getIcons().map(item => (
            <button 
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'car') {
                    window.location.href = '/booking/car';
                    return;
                }
                setActiveTab(item.id);
                const element = document.getElementById(`section-${item.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                minWidth: '80px',
                color: activeTab === item.id ? '#0f766e' : '#64748b',
              }}
            >
              <div style={{ 
                backgroundColor: activeTab === item.id ? '#ccfbf1' : '#f1f5f9', 
                padding: '1rem', 
                borderRadius: '1rem',
                boxShadow: activeTab === item.id ? '0 10px 15px -3px rgba(15, 118, 110, 0.2)' : 'none'
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: activeTab === item.id ? 700 : 600 }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Service Sections */}
      {[
        { id: 'plumbing', data: t.home.sections.plumbing, bg: '#f8fafc', img1: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop' },
        { id: 'repairs', data: t.home.sections.repairs, bg: '#ffffff', img1: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=600&auto=format&fit=crop', img2: 'https://images.unsplash.com/photo-1517646281691-137603c5ec76?q=80&w=600&auto=format&fit=crop' },
        { id: 'accounting', data: t.home.sections.accounting, bg: '#f0f9ff', fullImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop' },
        { id: 'renovation', data: t.home.sections.renovation, bg: '#ffffff', fullImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop' },
        { id: 'education', data: t.home.sections.education, bg: '#fdf4ff', fullImg: 'https://images.unsplash.com/photo-1516321321775-9e22197cf73b?q=80&w=800&auto=format&fit=crop' },
        { id: 'cleaning', data: t.home.sections.cleaning, bg: '#ffffff', fullImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop' },
        { id: 'legal', data: t.home.sections.legal, bg: '#f8fafc', fullImg: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop' },
        { id: 'commercial', data: t.home.sections.commercial, bg: '#ffffff', fullImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' }
      ].map((sec, idx) => (
        <section key={sec.id} id={`section-${sec.id}`} style={{ backgroundColor: sec.bg, padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: idx % 2 === 0 ? 'wrap' : 'wrap-reverse', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div style={{ flex: '1 1 400px', textAlign: 'inherit' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#134e4a', marginBottom: '1.5rem' }}>{sec.data.title}</h2>
                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem' }}>{sec.data.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {sec.data.items.map(sub => (
                    <Link key={sub} href={`/services/results?q=${sub}`} style={{ textDecoration: 'none', color: '#0f766e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} /> {sub}
                    </Link>
                  ))}
                </div>
              </div>
              <div style={{ flex: '1 1 500px' }}>
                 {sec.fullImg ? (
                   <img src={sec.fullImg} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                 ) : (
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <img src={sec.img1} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px' }} />
                      <img src={sec.img2} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px', marginTop: '2rem' }} />
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Popular Projects Grid */}
      <section className="container" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#134e4a', textAlign: 'inherit' }}>
            {activeTab === 'all' ? t.home.popularTitle : (t.home.categories as any)[activeTab]} 
            {city && city !== t.home.allUK && <span style={{ color: '#0f766e', fontWeight: 600, fontSize: '1.5rem' }}> {t.home.popularIn} {city}</span>}
          </h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
             [1,2,3,4].map(i => (
               <div key={i} className="animate-pulse" style={{ backgroundColor: '#f1f5f9', borderRadius: '16px', height: '300px' }} />
             ))
          ) : merchants.length > 0 ? merchants.map(m => (
            <Link href={`/merchant/${m.id}`} key={m.id} style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                textAlign: 'inherit',
                transition: 'transform 0.2s',
              }} className="hover-scale">
                <img src={`https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400&auto=format&fit=crop`} alt={m.companyName} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
                <div style={{ padding: '1.25rem 0.5rem 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{m.companyName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.9rem' }}>
                      <Star size={14} fill="#f59e0b" /> {m.averageRating.toFixed(1)}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>{t.search.basePrice} £{m.basePrice}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <MapPin size={12} /> {m.city}
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', borderRadius: '16px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>{t.home.noProjects.title}</h3>
               <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{t.home.noProjects.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* Trustpilot / Review Section */}
      <section className="container" style={{ maxWidth: '1200px', padding: '3rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t.home.reviews.excellent}</h3>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '0.25rem' }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ backgroundColor: '#00b67a', color: 'white', padding: '2px 4px' }}><Star size={16} fill="white"/></div>)}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.home.reviews.basedOn} <u>21,105 reviews</u></p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
              <Star size={18} fill="#00b67a" color="#00b67a"/> Trustpilot
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {[
              { id: 1, title: "He was really efficient...", desc: "Great service!", author: "Jasmine" },
              { id: 2, title: "Great service", desc: "My tasker was great!", author: "Katie" },
            ].map(rev => (
              <div key={rev.id} style={{ flex: 1, minWidth: '220px', textAlign: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: 'inherit' }}>
                   <div style={{ display: 'flex', gap: '1px' }}>
                    {[1,2,3,4,5].map(i => <div key={i} style={{ backgroundColor: '#00b67a', color: 'white', padding: '1px 2px' }}><Star size={10} fill="white"/></div>)}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', color: '#64748b' }}>
                    <CheckCircle2 size={10} fill="#64748b" color="white" /> {t.home.reviews.verified}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>{rev.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>{rev.desc}</p>
                <div style={{ fontSize: '0.7rem' }}><strong>{rev.author}</strong></div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
