"use client";

import { useState } from 'react';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, 
  Sparkles, Target, Landmark, Clock, 
  BrainCircuit, X, Trophy
} from 'lucide-react';

interface WizardProps {
  onComplete: (criteria: any) => void;
  onClose: () => void;
  category?: string;
}

export default function ExpertMatchingWizard({ onComplete, onClose, category }: WizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    goal: '',
    budget: 'Any',
    timing: 'Soon',
    style: 'Balanced'
  });

  const totalSteps = 4;

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    onComplete(data);
  };

  const categories: Record<string, string[]> = {
    'Education': ['Exam Prep', 'General Tutoring', 'Skill Building', 'University Application'],
    'Legal': ['Contract Review', 'Family Law', 'Property/Conveyancing', 'Business Advice'],
    'Plumbing': ['Leak Repair', 'Installation', 'Maintenance', 'Emergency'],
    'Accounting': ['Tax Return', 'Bookkeeping', 'Business Audit', 'Financial Planning'],
    'Default': ['Quick Fix', 'Long-term Project', 'Strategy Session', 'General Inquiry']
  };

  const goals = categories[category || 'Default'] || categories['Default'];

  return (
    <div style={{
      position: 'fixed', inset: 0, 
      backgroundColor: 'rgba(5, 5, 5, 0.95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, backdropFilter: 'blur(20px)'
    }}>
      <div style={{
        width: '100%', maxWidth: '550px',
        background: 'var(--surface-1)',
        borderRadius: '32px',
        border: '1.5px solid var(--gold-500)',
        boxShadow: '0 30px 100px rgba(212, 175, 55, 0.2)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'rgba(212,175,55,0.1)' }}>
          <div style={{ width: `${(step / totalSteps) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #d4af37, #f5e07a)', transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--gold-400)' }}>
              <Target size={24} />
              <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Phase 01: Objective</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>What is your primary goal today?</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {goals.map(g => (
                <button 
                  key={g}
                  onClick={() => { setData({...data, goal: g}); next(); }}
                  style={{
                    padding: '1.25rem', borderRadius: '16px',
                    background: data.goal === g ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: `1.5px solid ${data.goal === g ? 'var(--gold-500)' : 'var(--border-color)'}`,
                    color: 'var(--text-primary)', fontWeight: 700, textAlign: 'left',
                    cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'space-between'
                  }}
                >
                  {g} {data.goal === g && <CheckCircle2 size={18} color="var(--gold-500)" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--gold-400)' }}>
              <Landmark size={24} />
              <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Phase 02: Resource Allocation</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>Define your target budget range.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Value Focus', range: '£0 - £60' },
                { label: 'Premium', range: '£60 - £120' },
                { label: 'Elite', range: '£120 - £250' },
                { label: 'Unlimited', range: 'No Limit' }
              ].map(b => (
                <button 
                  key={b.label}
                  onClick={() => { setData({...data, budget: b.range}); next(); }}
                  style={{
                    padding: '2rem 1rem', borderRadius: '16px',
                    background: data.budget === b.range ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: `1.5px solid ${data.budget === b.range ? 'var(--gold-500)' : 'var(--border-color)'}`,
                    color: 'var(--text-primary)', textAlign: 'center',
                    cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  <div style={{ fontWeight: 900, marginBottom: '0.25rem' }}>{b.label}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{b.range}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Timing */}
        {step === 3 && (
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--gold-400)' }}>
              <Clock size={24} />
              <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Phase 03: Temporal Urgency</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>How fast do you need to initiate?</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { label: 'Immediate (Rapid Response)', val: 'Immediate' },
                { label: 'Within 24-48 Hours', val: 'Soon' },
                { label: 'Within 7 Days', val: 'Standard' },
                { label: 'Just Researching', val: 'Flexible' }
              ].map(t => (
                <button 
                  key={t.val}
                  onClick={() => { setData({...data, timing: t.val}); next(); }}
                  style={{
                    padding: '1.25rem', borderRadius: '16px',
                    background: data.timing === t.val ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: `1.5px solid ${data.timing === t.val ? 'var(--gold-500)' : 'var(--border-color)'}`,
                    color: 'var(--text-primary)', fontWeight: 700, textAlign: 'left',
                    cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Style */}
        {step === 4 && (
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--gold-400)' }}>
              <BrainCircuit size={24} />
              <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>Phase 04: Cognitive Style</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>What interaction style do you prefer?</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { l: 'Efficiency & Speed', s: 'Direct, focused on execution.' },
                { l: 'Deep Technical Detail', s: 'Thorough, data-driven methodology.' },
                { l: 'Consultative & Holistic', s: 'Long-term partnership approach.' }
              ].map(st => (
                <button 
                  key={st.l}
                  onClick={() => { setData({...data, style: st.l}); }}
                  style={{
                    padding: '1.25rem', borderRadius: '20px',
                    background: data.style === st.l ? 'var(--accent-soft)' : 'var(--surface-2)',
                    border: `1.5px solid ${data.style === st.l ? 'var(--gold-500)' : 'var(--border-color)'}`,
                    color: 'var(--text-primary)', textAlign: 'left',
                    cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{st.l}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{st.s}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            disabled={step === 1}
            onClick={prev}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-secondary)', 
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              opacity: step === 1 ? 0.3 : 1
            }}
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          {step < totalSteps ? (
            <button 
              onClick={next}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', padding: '0.8rem 1.5rem', borderRadius: '12px',
                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #f5e07a)', border: 'none',
                color: '#000', padding: '1rem 2rem', borderRadius: '16px',
                fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 10px 20px rgba(212,175,55,0.3)'
              }}
            >
              <Sparkles size={18} /> Generate Perfect Match
            </button>
          )}
        </div>

        {/* Branding */}
        <div style={{ position: 'absolute', bottom: '0.5rem', left: '0', right: '0', textAlign: 'center', opacity: 0.15 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 900 }}>
             <Trophy size={12} /> CONCIERGE AI ELITE CALIBRATION
          </div>
        </div>
      </div>
    </div>
  );
}
