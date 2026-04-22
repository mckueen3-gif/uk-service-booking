"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Search, ArrowRight, Loader2, CheckCircle2, 
  UserPlus, ShieldCheck, MapPin, Zap, MessageSquare,
  ChevronRight, Star
} from 'lucide-react';
import { matchLead } from '@/app/actions/ai-discovery';
import { useTranslation } from "@/components/LanguageContext";
import { useLocation } from "@/components/LocationContext";
import Link from 'next/link';

export default function AiMatchmaker() {
  const { t, isRTL } = useTranslation();
  const { city } = useLocation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'input' | 'matching' | 'results'>('input');
  
  const handleMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setStep('matching');
    
    try {
      const res = await matchLead(query, city);
      // Artificial delay for premium feel and analysis perception
      await new Promise(r => setTimeout(r, 2000));
      
      if (res.success) {
        setResult(res);
        setStep('results');
      }
    } catch (err) {
      console.error("Match Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuery('');
    setResult(null);
    setStep('input');
  };

  return (
    <div className="glass-panel stagger-1 reveal" style={{ 
      padding: 'clamp(1.5rem, 5vw, 4rem)',
      background: 'var(--soft-gradient)',
      border: '2px solid var(--gold-600)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '3rem',
      boxShadow: '0 30px 60px -12px rgba(212, 175, 55, 0.25)'
    }}>
      {/* Background Decorative Sparkles */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.1, pointerEvents: 'none' }}>
        <Sparkles size={120} color="var(--gold-600)" />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        
        {step === 'input' && (
          <div className="animate-fade-up">
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'var(--amber-600)', 
              color: 'white', 
              padding: '0.5rem 1.5rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              marginBottom: '2rem',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}>
              <Zap size={16} /> {t?.home?.growth?.activeLeadMatching || "AUTO-MATCHMAKER ACTIVE"}
            </div>
            
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {t?.home?.growth?.matchTitle1 || "Stuck? Let AI Find Your"} <span style={{ color: 'var(--amber-600)' }}>{t?.home?.growth?.matchTitle2 || "Elite Match"}</span>
            </h2>
            
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 500 }}>
              {t?.home?.growth?.matchSubtitle || "Tell us your specific problem - our engine will parse intent and notify the top-rated local specialists for you."}
            </p>

            <form onSubmit={handleMatch} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t?.home?.growth?.matchingPlaceholder || "e.g. I need a tax audit for my small business in London..."}
                style={{ 
                  width: '100%',
                  padding: '1.5rem 2rem',
                  paddingRight: isRTL ? '2rem' : '4rem',
                  paddingLeft: isRTL ? '4rem' : '2rem',
                  borderRadius: '1.5rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface-1)',
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <button 
                type="submit"
                disabled={!query.trim()}
                style={{ 
                  position: 'absolute',
                  right: isRTL ? 'auto' : '10px',
                  left: isRTL ? '10px' : 'auto',
                  top: '10px',
                  bottom: '10px',
                  background: 'var(--premium-gradient)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1.1rem',
                  padding: '0 1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 800
                }}>
                {t?.home?.growth?.matchButton || "Match Me"} <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
              </button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} /> {t?.home?.growth?.verifiedOnly || "Elite Only"}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                <MapPin size={16} /> {t?.home?.growth?.localMatching || "Local Priority"}
              </div>
            </div>
          </div>
        )}

        {step === 'matching' && (
          <div className="animate-fade-up" style={{ padding: '4rem 0' }}>
            <div className="pulse-gold" style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              margin: '0 auto 2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--premium-gradient)',
              color: 'white',
              boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)'
            }}>
              <Loader2 className="animate-spin" size={48} />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{t?.home?.growth?.analyzingIntent || "Analyzing Intent..." }</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t?.home?.growth?.matchingSubtitle || "Traversing our network for the highest-trust matches in your area."}</p>
          </div>
        )}

        {step === 'results' && result && (
          <div className="animate-fade-up">
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: '#10b981', 
              color: 'white', 
              padding: '0.5rem 1.5rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              marginBottom: '1.5rem'
            }}>
              <CheckCircle2 size={16} /> {result.matchCount} {t?.home?.growth?.matchesFound || "Elite Matches Found"}
            </div>
            
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>{t?.home?.growth?.readyToConfirm || "Matches Ready for Deployment"}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 500, fontStyle: 'italic' }}>
              &ldquo;{result.report}&rdquo;
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {result.matches.map((m: any, idx: number) => (
                <div key={m.id} className="glass-panel" style={{ 
                  padding: '1.5rem', 
                  textAlign: 'left',
                  background: idx === 0 ? 'rgba(212, 175, 55, 0.05)' : 'var(--surface-1)',
                  border: idx === 0 ? '1px solid var(--gold-600)' : '1px solid var(--border-color)',
                  position: 'relative'
                }}>
                  {idx === 0 && (
                    <div style={{ position: 'absolute', top: '-10px', right: '1rem', background: 'var(--amber-600)', color: 'white', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>
                      {t?.home?.growth?.topMatch || "TOP MATCH"}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', background: 'var(--surface-2)' }}>
                      <img src={m.avatarUrl || '/images/default-avatar.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{m.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gold-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                         <Star size={12} fill="currentColor" /> {m.rating} | {m.completedJobsCount}+ {t?.home?.growth?.jobsLabel || "Jobs"}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', height: '2.5rem', overflow: 'hidden' }}>
                    {m.bio?.substring(0, 80)}...
                  </div>
                  <Link href={`/profile/${m.id}`} target="_blank">
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}>
                      {t?.home?.growth?.viewProfile || "Secure Match"}
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button 
                onClick={reset}
                style={{ 
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  padding: '1rem 2rem',
                  borderRadius: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}>
                  {t?.common?.back || "RE-SCAN"}
               </button>
               <button 
                className="btn btn-primary shimmer-deluxe" 
                style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                  {t?.home?.growth?.notifyMatches || "IDENTIFY ALL ELITE MATCHES"} <ChevronRight size={20} />
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
