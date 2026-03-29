"use client";

import { useState } from 'react';
import { 
  ChevronRight, Car, Settings, Gauge, Search, AlertCircle, 
  CheckCircle2, Info, ArrowLeft, PenTool, Wrench, Sparkles, Navigation
} from 'lucide-react';
import { lookupVehicle } from '@/app/actions/vehicle-lookup';
import { getAiEstimate } from '@/lib/ai-pricing';
import Link from 'next/link';

const SERVICE_CATEGORIES = [
  {
    id: 'routine',
    title: 'Routine Service / 保養',
    items: [
      { name: 'Interim Service', desc: '6 months / 6,000 miles' },
      { name: 'Full Service', desc: '12 months / 12,000 miles' },
      { name: 'Major Service', desc: '24 months / 24,000 miles' },
    ]
  },
  {
    id: 'mot',
    title: 'MOT Test',
    items: [
      { name: 'MOT Test', desc: 'Standard UK MOT' },
      { name: 'MOT + Full Inspection', desc: 'Pre-MOT check + Test' },
    ]
  },
  {
    id: 'tyres',
    title: 'Tyres / 車呔',
    items: [
      { name: '2 Tyres Replacement', desc: 'Fitting + Balancing' },
      { name: '4 Tyres Replacement', desc: 'Full set + Alignment' },
    ]
  },
  {
    id: 'repairs',
    title: 'Repairs / 維修',
    items: [
      { name: 'Brake pads replacement', desc: 'Front or Rear' },
      { name: 'Oil & Filter Change', desc: 'Premium synthetic oil' },
      { name: 'Diagnostic Check', desc: 'Full scan + Report' },
    ]
  }
];

export default function CarBookingPage() {
  const [step, setStep] = useState(1);
  const [vrm, setVrm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicle, setVehicle] = useState<{ make: string; model: string; year: string; engine: string } | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState('');

  const handleLookup = async () => {
    if (!vrm) return;
    setLoading(true);
    setError('');
    const res = await lookupVehicle(vrm);
    setLoading(false);
    if (res.success && res.data) {
      setVehicle(res.data);
      setStep(2);
    } else {
      setError(res.error || 'Identifier failed');
    }
  };

  const currentEstimate = selectedService && vehicle 
    ? getAiEstimate(selectedService, vehicle.make) 
    : null;

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '6rem', paddingBottom: '10rem' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ 
            flex: 1, height: '4px', 
            backgroundColor: step >= i ? 'var(--accent-color)' : 'var(--border-color)',
            borderRadius: '2px',
            transition: 'background-color 0.3s'
          }} />
        ))}
      </div>

      {step === 1 && (
        <section className="glass-panel animate-scale-in">
          <h1 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'center' }}>Tell us about your car</h1>
          <div style={{ marginTop: '2.5rem' }}>
             <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                UK Registration Number (e.g. AB12 CDE)
             </label>
             <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  className="input-field"
                  placeholder="ENTER PLATE"
                  value={vrm}
                  onChange={(e) => setVrm(e.target.value.toUpperCase())}
                  style={{ flex: 1, fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.1em', padding: '1rem' }}
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleLookup}
                  disabled={loading || !vrm}
                  style={{ minWidth: '220px' }}
                >
                  {loading ? <div className="animate-spin"><Navigation size={20}/></div> : <><Search size={20} /> Auto-fill my car details</>}
                </button>
             </div>
             {error && <p style={{ color: '#ef4444', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {error}
             </p>}
             <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                輸入車牌可自動獲取車輛規格，我們只用嚟提供更準確報價及推薦服務。
             </p>
          </div>

          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center' }}>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>如果您不想輸入車牌，可以手動輸入</p>
             <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Manually enter details Instead <ChevronRight size={18} />
             </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <div className="animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setStep(1)}>
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Choose Service</h2>
                {vehicle && <p style={{ color: 'var(--accent-color)', fontWeight: 700 }}>已識別 [{vrm}]：{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.engine}</p>}
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {SERVICE_CATEGORIES.map(cat => (
              <div key={cat.id} className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                 <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--accent-color)' }}>
                    {cat.id === 'routine' && <Settings size={20} />}
                    {cat.id === 'mot' && <CheckCircle2 size={20} />}
                    {cat.id === 'tyres' && <Gauge size={20} />}
                    {cat.id === 'repairs' && <Wrench size={20} />}
                    <span style={{ color: 'var(--text-primary)' }}>{cat.title}</span>
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cat.items.map(item => (
                      <button 
                        key={item.name}
                        onClick={() => {
                          setSelectedService(item.name);
                          setStep(3);
                        }}
                        style={{ 
                          textAlign: 'left', 
                          padding: '1rem', 
                          borderRadius: '0.75rem', 
                          border: '1px solid var(--border-color)',
                          backgroundColor: selectedService === item.name ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          color: 'var(--text-primary)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.backgroundColor = selectedService === item.name ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                         <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{item.name}</div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                      </button>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-up">
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setStep(2)}>
                <ArrowLeft size={20} />
             </button>
             <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Estimate & Booking</h2>
          </div>

          <div className="glass-panel" style={{ display: 'grid', gap: '2rem', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <div>
                   <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Selected Service</h3>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-color)' }}>{selectedService}</div>
                   <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>For your {vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>AI Range Estimate</h3>
                   <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>{currentEstimate?.range}</div>
                   <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentEstimate?.disclaimer}</p>
                </div>
             </div>

             <div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Describe any specific issues (Optional)</h4>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  placeholder="e.g. brakes making squeaking noise when stopping..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                />
             </div>

             <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1rem', border: '1px dashed var(--accent-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                   <span>Initial Diagnostic Fee / 診斷費</span>
                   <span style={{ fontWeight: 700 }}>£{currentEstimate?.diagnosticsFee}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                   * 先收小額診斷費，師傅上門檢查後會根據實際損壞情況提供最終維修方案。
                </p>
             </div>

             <Link href="/checkout" style={{ width: '100%' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                   Confirm & Find a Mechanic <ChevronRight />
                </button>
             </Link>
          </div>
        </div>
      )}

    </div>
  );
}
