"use client";

import { 
  CheckCircle2, AlertTriangle, PoundSterling, Clock, 
  MapPin, ShieldCheck, ChevronRight, Share2 
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  diagnosis: {
    category: string;
    issue: string;
    suggestedFix: string;
    estimatedPriceRange: string;
    confidence: number;
    imageUrl: string;
  };
}

export default function DiagnosisResult({ diagnosis }: Props) {
  const confidencePercent = Math.round(diagnosis.confidence * 100);
  
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Image Sidebar */}
          <div style={{ flex: '1 1 300px', minHeight: '300px', position: 'relative' }}>
            <img 
              src={diagnosis.imageUrl} 
              alt="Diagnosis Source" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
              Analyzed Photo
            </div>
          </div>

          {/* Diagnosis Content */}
          <div style={{ flex: '2 1 400px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--emerald-50)', color: 'var(--emerald-800)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {diagnosis.category} Diagnosis
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-600)', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> {confidencePercent}% Confidence
              </div>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>AI Repair Insight</h2>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', borderLeft: '4px solid var(--emerald-600)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 Detected Issue
              </h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{diagnosis.issue}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Recommended Solution</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{diagnosis.suggestedFix}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', background: 'var(--emerald-50)', borderRadius: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ color: 'var(--emerald-800)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Estimated Cost</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--emerald-950)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PoundSterling size={24} /> {diagnosis.estimatedPriceRange}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--emerald-800)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>UK Service Standard</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--emerald-800)', fontWeight: 600 }}>Includes Labor & Parts</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href={`/services/results?q=${diagnosis.category}`} style={{ flex: 2 }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  Book Verified Specialist <ChevronRight size={20} />
                </button>
              </Link>
              <button className="btn" style={{ background: 'var(--surface-2)', padding: '1rem' }}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Next Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ color: 'var(--emerald-600)' }}><ShieldCheck size={32} /></div>
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Guaranteed Repairs</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All bookings include our AI-driven dispute resolution for peace of mind.</p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ color: 'var(--emerald-600)' }}><Clock size={32} /></div>
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Fast Turnaround</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Most {diagnosis.category.toLowerCase()} specialists respond within 2 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
