"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Sparkles, BookOpen, Clock, Video } from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

export default function TutorCard({ tutor, isAIMatch = false }: { tutor: any, isAIMatch?: boolean }) {
  const { t } = useTranslation();
  
  const { 
    id = "1", 
    name = "Expert Tutor", 
    subjects = "Education Specialist",
    rate = 0,
    rating = 5.0,
    reviews = 0,
    location = "United Kingdom",
    mode = "Hybrid",
    matchScore = 95,
    avatarUrl = null
  } = tutor || {};

  return (
    <div className="glass-panel hover-lift" style={{ 
      padding: '1.75rem', 
      borderRadius: '24px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1.25rem',
      backgroundColor: 'var(--surface-1)',
      border: isAIMatch ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isAIMatch ? '0 10px 25px -5px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)'
    }}>
      {/* Premium AI Badge Overlay */}
      {isAIMatch && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#059669', fontSize: '0.8rem', fontWeight: 900,
          zIndex: 10
        }}>
          <Sparkles size={14} /> {matchScore}% MATCH
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative' }}>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              style={{ 
                width: '72px', height: '72px', borderRadius: '22px', 
                objectFit: 'cover', border: '2.5px solid var(--surface-1)',
                boxShadow: 'var(--shadow-md)'
              }} 
            />
          ) : (
            <div style={{ 
              width: '72px', height: '72px', borderRadius: '22px', 
              backgroundColor: 'var(--surface-2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)',
              border: '2.5px solid var(--surface-1)',
              boxShadow: 'var(--shadow-md)'
            }}>
              {String(name).charAt(0)}
            </div>
          )}
          {rating >= 4.8 && (
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px',
              backgroundColor: '#f59e0b', color: 'white',
              width: '24px', height: '24px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--surface-1)', fontSize: '0.7rem'
            }}>
              <Star size={12} fill="white" />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{name}</h3>
          <div style={{ 
            display: 'inline-block', color: 'var(--accent-color)', 
            fontSize: '0.8rem', fontWeight: 800, padding: '2px 8px', 
            backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: '6px',
            marginBottom: '0.75rem'
          }}>
            {subjects}
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {mode === 'Online' ? <Video size={14} /> : <BookOpen size={14} />} {mode}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 900, fontSize: '1.05rem' }}>{Number(rating).toFixed(1)}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>({reviews} {t.education_sec.common.reviews})</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            £{rate}<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t.education_sec.common.hr}</span>
          </div>
        </div>
        
        <Link href={`/education/tutor/${id}`} style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary" style={{ 
            padding: '0.75rem 1.75rem', borderRadius: '14px', fontSize: '0.95rem',
            fontWeight: 800, letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
          }}>
            {t.education_sec.common.bookTrial}
          </button>
        </Link>
      </div>
    </div>
  );
}
