"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Sparkles, Globe, Briefcase, GraduationCap, Clock, Award, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/components/LanguageContext';
import TutorCard from '@/components/education/TutorCard';

export default function EducationLandingPage() {
  const { t } = useTranslation();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/education/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { id: 'academic', icon: <GraduationCap size={28} />, color: '#6366f1' },
    { id: 'language', icon: <Globe size={28} />, color: '#facc15' },
    { id: 'professional', icon: <Briefcase size={28} />, color: '#f59e0b' },
    { id: 'children', icon: <Users size={28} />, color: '#ec4899' },
    { id: 'exam', icon: <Award size={28} />, color: '#8b5cf6' },
    { id: 'workshops', icon: <Clock size={28} />, color: '#14b8a6' },
  ];

  React.useEffect(() => {
    fetch('/api/education/tutors')
      .then(res => res.json())
      .then(data => {
        setTutors(data.tutors || []);
        setLoadingTutors(false);
      })
      .catch(e => {
        console.error(e);
        setLoadingTutors(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '6rem 2rem 8rem', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            borderRadius: '999px', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
            color: 'var(--accent-color)',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> {t.education_sec.hero.badge}
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {t.education_sec.hero.title1} <span style={{ color: 'var(--accent-color)' }}>{t.education_sec.hero.title2}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', fontWeight: 500 }}>
            {t.education_sec.hero.subtitle}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--surface-1)', 
            padding: '0.75rem', 
            borderRadius: '1.5rem', 
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Search size={22} color="var(--text-muted)" style={{ margin: '0 1rem' }} />
            <input 
              type="text" 
              placeholder={t.education_sec.hero.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                border: 'none', 
                background: 'transparent', 
                outline: 'none', 
                fontSize: '1.1rem',
                color: 'var(--text-primary)'
              }} 
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '1rem', fontSize: '1.05rem' }}>
              {t.education_sec.hero.searchBtn}
            </button>
          </form>
        </div>
      </section>

      {/* For You Area (AI Recommendations) */}
      <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 20 }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <Sparkles size={24} color="#facc15" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.education_sec.forYou.title}</h2>
          </div>
          
          {loadingTutors ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Searching for experts...</div>
          ) : tutors.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No tutors available right now. Please check back later!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {tutors.map((tutor, i) => (
                <TutorCard key={tutor.id} tutor={tutor} isAIMatch={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>{t.education_sec.categories.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {categories.map(cat => (
            <div key={cat.id} className="glass-panel hover-scale" style={{ 
              padding: '2rem', 
              borderRadius: '24px', 
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.3s'
            }}>
              <div style={{ 
                width: '60px', height: '60px', 
                borderRadius: '16px', 
                backgroundColor: `${cat.color}20`, 
                color: cat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {t.education_sec.categories.items[cat.id]?.title || cat.id}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '40px' }}>
                {t.education_sec.categories.items[cat.id]?.desc || ""}
              </p>
              <Link href={`/education/search?category=${cat.id}`} style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '12px',
                backgroundColor: 'var(--surface-2)'
              }}>
                {t.education_sec.categories.browseBtn} <span style={{ color: cat.color }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
