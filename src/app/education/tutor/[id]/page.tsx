"use client";

import React, { useState } from 'react';
import { MapPin, Star, Sparkles, BookOpen, Clock, Video, UserCheck, ShieldCheck, GraduationCap, PlayCircle } from 'lucide-react';
import Link from 'next/link';

// Demo data for the profile
const DEMO_PROFILE = {
  id: "1",
  name: "Dr. Emily Smith",
  subjects: ["GCSE Maths", "GCSE Physics", "A-Level Physics"],
  rate: 40,
  rating: 4.9,
  reviews: 124,
  location: "Manchester",
  mode: "Hybrid",
  bio: "Experienced PhD tutor specializing in making complex scientific concepts easy to understand. I have helped over 100 students achieve A* in their GCSEs. My teaching style is interactive and focuses on active recall and exam techniques.",
  experience: "8 Years",
  education: "PhD in Applied Physics, University of Manchester",
  availability: [
    { day: "Monday", slots: ["16:00", "17:00", "18:00"] },
    { day: "Wednesday", slots: ["15:00", "16:00", "19:00"] },
    { day: "Saturday", slots: ["09:00", "10:00", "11:00"] },
  ]
};

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [showAITrial, setShowAITrial] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', 
                backgroundColor: 'var(--surface-2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)'
              }}>
                {DEMO_PROFILE.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{DEMO_PROFILE.name}</h1>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {DEMO_PROFILE.subjects.map(sub => (
                        <span key={sub} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', padding: '0.3rem 0.8rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>£{DEMO_PROFILE.rate}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/hr</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <Star size={18} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{DEMO_PROFILE.rating}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({DEMO_PROFILE.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={18} /> {DEMO_PROFILE.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Video size={18} /> {DEMO_PROFILE.mode}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}><ShieldCheck size={18} /> Verified Tutor</span>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>About Me</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {DEMO_PROFILE.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-2)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <GraduationCap size={20} color="var(--accent-color)" />
                  <h4 style={{ fontWeight: 800 }}>Education</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{DEMO_PROFILE.education}</p>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface-2)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <UserCheck size={20} color="var(--accent-color)" />
                  <h4 style={{ fontWeight: 800 }}>Experience</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{DEMO_PROFILE.experience} Tutoring</p>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Student Reviews</h3>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h5 style={{ fontWeight: 700 }}>Matthew L.</h5>
                <div style={{ display: 'flex' }}><Star size={14} fill="#f59e0b" color="#f59e0b" /><Star size={14} fill="#f59e0b" color="#f59e0b" /><Star size={14} fill="#f59e0b" color="#f59e0b" /><Star size={14} fill="#f59e0b" color="#f59e0b" /><Star size={14} fill="#f59e0b" color="#f59e0b" /></div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Dr. Smith is amazing! She helped me improve my Maths grade from a 5 to an 8 in just 3 months. Highly recommend.</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Booking */}
        <aside style={{ width: '380px' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', position: 'sticky', top: '100px' }}>
            
            <button 
              onClick={() => setShowAITrial(true)}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '16px', 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                cursor: 'pointer', marginBottom: '2rem', transition: 'transform 0.2s'
              }}
              className="hover-scale"
            >
              <Sparkles size={20} color="#10b981" /> AI 15-Min Trial Session
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} /> Availability
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {DEMO_PROFILE.availability.map((day) => (
                <div key={day.day}>
                  <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{day.day}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {day.slots.map(slot => (
                      <button key={slot} style={{ 
                        padding: '0.5rem 1rem', borderRadius: '8px', 
                        border: '1px solid var(--accent-color)', background: 'transparent',
                        color: 'var(--accent-color)', fontWeight: 600, cursor: 'pointer'
                      }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}>
              Book Now
            </button>
          </div>
        </aside>

      </div>

      {/* AI Trial Modal Simulation */}
      {showAITrial && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ 
            backgroundColor: 'var(--surface-1)', padding: '3rem', borderRadius: '24px', 
            width: '100%', maxWidth: '600px', border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <Sparkles size={48} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>AI Trial Challenge</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Generate 5 quick diagnostic questions for <b>GCSE Maths</b> to let Dr. Smith know your current level before booking!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setShowAITrial(false)} style={{ padding: '0.8rem 2rem' }}>Start Challenge</button>
              <button onClick={() => setShowAITrial(false)} style={{ padding: '0.8rem 2rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
