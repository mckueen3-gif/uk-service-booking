"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/LanguageContext';
import SpecialistCard from './SpecialistCard';

interface SubCategory {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface CategoryLandingProps {
  categoryKey: string;
  categoryName: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  subCategories: SubCategory[];
  apiEndpoint?: string;
}

export default function CategoryLanding({
  categoryKey,
  categoryName,
  heroBadge,
  heroTitle1,
  heroTitle2,
  heroSubtitle,
  searchPlaceholder,
  searchBtn,
  subCategories,
  apiEndpoint = '/api/merchants'
}: CategoryLandingProps) {
  const { t, format } = useTranslation();
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services/results?q=${encodeURIComponent(searchQuery)}&cat=${categoryName}`);
    }
  };

  useEffect(() => {
    // Determine the category parameter for the API
    const fetchUrl = `${apiEndpoint}?category=${categoryKey}`;
    
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        // Handle both specific (e.g., tutors) and general responses
        const list = data.specialists || data.tutors || data.merchants || [];
        setSpecialists(list);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [categoryKey, apiEndpoint]);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '6rem 2rem 8rem', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
        textAlign: 'center'
      }}>
        {/* Abstract background elements */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%', 
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', 
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 20px', 
            borderRadius: '999px', 
            backgroundColor: 'rgba(212, 175, 55, 0.12)', 
            color: '#d4af37',
            fontWeight: 800,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <Sparkles size={14} /> {heroBadge}
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
            {heroTitle1} <br />
            <span style={{ 
              background: 'linear-gradient(to right, #d4af37, #facc15)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              {heroTitle2}
            </span>
          </h1>
          <p style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', fontWeight: 500, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            {heroSubtitle}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--surface-1)', 
            padding: '0.6rem', 
            borderRadius: '1.75rem', 
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            maxWidth: '650px',
            margin: '0 auto',
            backdropFilter: 'blur(20px)'
          }}>
            <Search size={22} color="var(--text-muted)" style={{ margin: '0 1.25rem' }} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                outline: 'none', 
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                fontWeight: 500
              }} 
            />
            <button type="submit" className="btn btn-primary" style={{ 
              padding: '0.9rem 2.5rem', 
              borderRadius: '1.25rem', 
              fontSize: '1.05rem',
              fontWeight: 800,
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              {searchBtn}
            </button>
          </form>
        </div>
      </section>

      {/* For You Area (AI Recommendations) */}
      <section className="container" style={{ marginTop: '-4.5rem', position: 'relative', zIndex: 20 }}>
        <div className="glass-panel" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '16px', 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Sparkles size={26} color="#d4af37" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                  {t?.home?.recommendation?.title1} {t?.home?.recommendation?.title2}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0' }}>{t?.common?.aiMatchingSub}</p>
              </div>
            </div>
            <Link href={`/services/results?cat=${categoryName}`} style={{ textDecoration: 'none', color: 'var(--accent-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t?.home?.recommendation?.browse} <ArrowRight size={18} />
            </Link>
          </div>
          
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div className="shimmer" style={{ width: '100%', height: '200px', borderRadius: '20px' }}></div>
            </div>
          ) : specialists.length === 0 ? (
            <div style={{ 
              padding: '4rem', textAlign: 'center', 
              backgroundColor: 'var(--surface-2)', borderRadius: '24px',
              border: '2px dashed var(--border-color)'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>{t?.home?.noResults}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {specialists.slice(0, 3).map((spec, i) => (
                <SpecialistCard key={spec.id} specialist={spec} isAIMatch={true} category={categoryKey} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sub-Categories (Knowledge Hexagons) */}
      <section className="container" style={{ marginTop: '7rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            {t?.education_sec?.categories?.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {format(t?.common?.exploreSub, { category: categoryName })}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {subCategories.map(cat => (
            <div key={cat.id} className="glass-panel hover-lift" style={{ 
              padding: '2.5rem', 
              borderRadius: '28px', 
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }} onClick={() => router.push(`/services/results?cat=${categoryName}&q=${cat.title}`)}>
              {/* Subtle background icon */}
              <div style={{ 
                position: 'absolute', top: '10px', right: '10px', 
                opacity: 0.03, transform: 'scale(4) rotate(-15deg)', 
                color: cat.color, zIndex: 0 
              }}>
                {cat.icon}
              </div>

              <div style={{ 
                width: '64px', height: '64px', 
                borderRadius: '18px', 
                backgroundColor: `${cat.color}15`, 
                color: cat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.75rem',
                border: `1px solid ${cat.color}30`,
                position: 'relative',
                zIndex: 1
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
                {cat.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.5, position: 'relative', zIndex: 1, minHeight: '3em' }}>
                {cat.desc}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
                {t?.education_sec?.categories?.browseBtn} <ArrowRight size={18} style={{ color: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Ecosystem Trust Signala */}
      <section className="container" style={{ marginTop: '8rem' }}>
        <div className="glass-panel" style={{ 
          padding: '4rem 2rem', 
          borderRadius: '32px', 
          textAlign: 'center',
          background: 'linear-gradient(to bottom, var(--surface-1), var(--surface-2))'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>{t?.common?.escrow?.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            {format(t?.common?.escrow?.subtitle, { category: categoryName })}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>Top 1%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t?.common?.escrow?.specialists}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>£0</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t?.common?.escrow?.fees}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)' }}>24/7</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t?.common?.escrow?.support}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
