"use client";

import React from 'react';
import Link from 'next/link';
import { Search, MapPin, Sparkles, BookOpen, Globe, Briefcase, GraduationCap, Clock, Award, Users } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 'academic', title: 'Academic Tutoring', desc: 'GCSE, A-Level, University Support', icon: <GraduationCap size={28} />, color: '#6366f1' },
  { id: 'language', title: 'Language Courses', desc: 'English, Mandarin, Polish, French', icon: <Globe size={28} />, color: '#10b981' },
  { id: 'professional', title: 'Professional Skills', desc: 'IT/Coding, Accounting, Project Management', icon: <Briefcase size={28} />, color: '#f59e0b' },
  { id: 'children', title: 'Children & Youth', desc: 'Primary, 11+, Music, Arts', icon: <Users size={28} />, color: '#ec4899' },
  { id: 'exam', title: 'Exam Preparation', desc: 'IELTS, PTE, Driving Theory, CPA', icon: <Award size={28} />, color: '#8b5cf6' },
  { id: 'workshops', title: 'Short Workshops', desc: 'Cooking, Fitness, AI Tools Training', icon: <Clock size={28} />, color: '#14b8a6' },
];

export default function EducationLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/education/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            <Sparkles size={16} /> AI-Powered Matching
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Find Your Perfect <span style={{ color: 'var(--accent-color)' }}>Tutor</span> in Minutes
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', fontWeight: 500 }}>
            AI 智能匹配 • 線上 / 線下 • Nottingham & Manchester 本地導師
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
              placeholder="e.g. GCSE Maths tutor near me..." 
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
              Search
            </button>
          </form>
        </div>
      </section>

      {/* For You Area (AI Recommendations) */}
      <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 20 }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <Sparkles size={24} color="#10b981" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI 推薦導師 (For You)</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Example AI Recommendation Card */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px', 
                padding: '1.5rem',
                backgroundColor: 'var(--surface-1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>T{i}</div>
                    <div>
                      <h4 style={{ fontWeight: 800 }}>Tutor {i}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>GCSE Maths & Physics</p>
                    </div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                    9{Math.floor(Math.random() * 9)}% Match
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  <MapPin size={14} /> Nottingham (Online/Offline)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>£35<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/hr</span></span>
                  <Link href={`/education/search`} style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>View Profile →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Explore Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {CATEGORIES.map(cat => (
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{cat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', minHeight: '40px' }}>{cat.desc}</p>
              <Link href={`/education/search?category=${cat.id}`} style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '12px',
                backgroundColor: 'var(--surface-2)'
              }}>
                Browse Tutors <span style={{ color: cat.color }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
