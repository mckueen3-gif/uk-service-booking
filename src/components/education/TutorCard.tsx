"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Sparkles, BookOpen, Clock, Video } from 'lucide-react';

export default function TutorCard({ tutor, isAIMatch = false }: { tutor: any, isAIMatch?: boolean }) {
  // Demo default values
  const { 
    id = "1", 
    name = "Dr. Emily Smith", 
    subjects = "GCSE Maths & Science",
    rate = 40,
    rating = 4.9,
    reviews = 124,
    location = "Manchester",
    mode = "Hybrid",
    matchScore = 96
  } = tutor || {};

  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      borderRadius: '20px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1.25rem',
      backgroundColor: 'var(--surface-1)',
      border: isAIMatch ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {isAIMatch && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1))',
          height: '4px'
        }} />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            backgroundColor: 'var(--surface-2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)'
          }}>
            {name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.2rem' }}>{name}</h3>
            <p style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>{subjects}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {location}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {mode === 'Online' ? <Video size={14} /> : <BookOpen size={14} />} {mode}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {isAIMatch && (
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '4px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
              padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800,
              marginBottom: '0.5rem'
            }}>
              <Sparkles size={14} /> {matchScore}% Match
            </div>
          )}
          <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>£{rate}<span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/hr</span></div>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        Experienced PhD tutor specializing in making complex scientific concepts easy to understand. I have helped over 100 students achieve A* in their GCSEs.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontWeight: 800 }}>{rating}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({reviews} reviews)</span>
        </div>
        
        <Link href={`/education/tutor/${id}`}>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            Book Trial
          </button>
        </Link>
      </div>
    </div>
  );
}
