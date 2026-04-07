"use client";

import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import TutorCard from '@/components/education/TutorCard';
import { useSearchParams, useRouter } from 'next/navigation';

const DEMO_TUTORS = [
  { id: "1", name: "Dr. Emily Smith", subjects: "GCSE Maths & Physics", rate: 40, rating: 4.9, reviews: 124, location: "Manchester", mode: "Hybrid", matchScore: 98, avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "2", name: "Sarah Connor", subjects: "IELTS Preparation", rate: 30, rating: 4.8, reviews: 89, location: "Online", mode: "Online", matchScore: 92, avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "3", name: "Ahmed Hassan", subjects: "A-Level Chemistry", rate: 35, rating: 4.7, reviews: 56, location: "Nottingham", mode: "Offline", matchScore: 85, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "4", name: "Luisa Davies", subjects: "Primary 11+ Preparation", rate: 30, rating: 5.0, reviews: 210, location: "Manchester", mode: "Hybrid", matchScore: 80, avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "5", name: "James Williams", subjects: "Python Programming", rate: 45, rating: 4.9, reviews: 45, location: "Online", mode: "Online", matchScore: 75, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" },
];

import { useTranslation } from '@/components/LanguageContext';

function SearchContent() {
  const { t, format } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/education/tutors?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        setTutors(data.tutors || []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [query, category]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/education/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Filters Sidebar */}
      <aside style={{ 
        width: '300px', 
        backgroundColor: 'var(--surface-1)', 
        padding: '1.5rem', 
        borderRadius: '24px', 
        border: '1px solid var(--border-color)',
        position: 'sticky',
        top: '100px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Filter size={20} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t.education_sec.search.filters}</h2>
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>{t.education_sec.categories.title}</h4>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {['academic', 'language', 'stem', 'arts', 'finance', 'career', 'junior', 'masterclass', 'sen'].map(catId => (
              <label key={catId} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={searchParams.get('category') === catId}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.checked) params.set('category', catId);
                    else params.delete('category');
                    router.push(`/education/search?${params.toString()}`);
                  }}
                /> 
                {t.education_sec.categories.items[catId]?.title || catId}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>{t.education_sec.search.mode}</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> {t.education_sec.search.online}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> {t.education_sec.search.offline}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> {t.education_sec.search.hybrid}
          </label>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>{t.education_sec.search.priceRange} (£/hr)</h4>
          <input type="range" min="10" max="100" defaultValue="50" style={{ width: '100%', accentColor: 'var(--accent-color)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <span>£10</span>
            <span>£100+</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>{t.education_sec.search.level}</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" /> {t.education_sec.search.student}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> {t.education_sec.search.pro}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> {t.education_sec.search.expert}
          </label>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }}>{t.education_sec.search.apply}</button>
      </aside>

      {/* Results Area */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t.education_sec.search.resultsTitle}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{format(t.education_sec.search.foundCount, { count: tutors.length })}</p>
          </div>
          
          <div style={{ 
            display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-1)', 
            padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '300px'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.education_sec.search.placeholder} 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }} 
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 700 }}>
            <Sparkles size={24} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Curating the best experts for you...</p>
          </div>
        ) : tutors.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '24px' }}>
             <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>No Experts Found</h3>
             <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {tutors.map((tutor, idx) => (
              <TutorCard key={tutor.id} tutor={tutor} isAIMatch={idx < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EducationSearchPage() {
  const { t } = useTranslation();
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </React.Suspense>
    </div>
  );
}
