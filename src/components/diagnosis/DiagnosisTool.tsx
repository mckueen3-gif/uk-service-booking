"use client";

import { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, Loader2, ChevronRight, 
  AlertCircle, CheckCircle2, Info, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { getAIDiagnosis, getAIDiagnosisCount } from '@/app/actions/diagnosis';
import DiagnosisResult from './DiagnosisResult';
import { useTranslation } from '@/components/LanguageContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

interface AIDiagnosisResult {
  id: string;
  category: string;
  issue: string;
  suggestedFix: string;
  estimatedPriceRange: string;
  confidence: number;
  imageUrl: string;
  createdAt: Date;
  provider?: string;
}

export default function DiagnosisTool() {
  const { t, locale } = useTranslation();
  
  // Reactive categories to ensure language switching works instantly
  const CATEGORIES = [
    { id: 'Plumbing', label: t.diagnosis?.tool?.categories?.plumbing || "水電工程", icon: '🚰' },
    { id: 'Renovation', label: t.diagnosis?.tool?.categories?.renovation || "房屋裝修", icon: '🏠' },
    { id: 'Electrical', label: t.diagnosis?.tool?.categories?.electrical || "電力工程", icon: '⚡' },
    { id: 'Cleaning', label: t.diagnosis?.tool?.categories?.cleaning || "專業清潔", icon: '✨' },
  ];

  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session) {
      getAIDiagnosisCount().then(res => {
        setRemainingUses(res.remaining ?? 5);
        if (res.remaining === 0) setQuotaExceeded(true);
      });
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!preview || !category) {
      setError(t.diagnosis.tool.errorPhotoCategory);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Image Compression (Client-side to prevent 'stuck' large payloads)
      const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const MAX_HEIGHT = 1200;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality
            };
          };
        });
      };

      const base64data = await compressImage(file!);
      const res = await getAIDiagnosis(base64data, category, locale, description, strictMode);
      
      if (res.error === "AUTH_REQUIRED") {
        window.location.href = "/auth/login?callbackUrl=/diagnosis";
        return;
      }

      if (res.error === "LIMIT_REACHED") {
        setQuotaExceeded(true);
        setError(null);
      } else if (res.error) {
        setError(res.error);
      } else if (res.diagnosis) {
        setResult({ ...res.diagnosis, provider: (res as any).provider });
        if (res.remainingUses !== undefined) setRemainingUses(res.remainingUses);
      }
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(t.diagnosis.tool.errorUnexpected + errorMessage);
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="glass-panel reveal active" style={{ padding: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <ShieldCheck size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{t.diagnosis.tool.authRequired}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{t.auth.login.subtitle}</p>
        <Link href="/auth/login?callbackUrl=/diagnosis">
          <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>{t.nav.login}</button>
        </Link>
      </div>
    );
  }

  if (quotaExceeded) {
    return (
      <div className="glass-panel reveal active" style={{ padding: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef2f2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <AlertCircle size={40} />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1rem', color: '#b91c1c' }}>{t.diagnosis.tool.limitReached}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem', fontWeight: 500 }}>{t.diagnosis.tool.limitReachedHint}</p>
        
        <div style={{ background: 'var(--surface-2)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t.diagnosis.tool.bookSpecialist}</h3>
          <Link href={`/services/results?category=${category || 'Plumbing'}`}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
              {t.diagnosis.tool.findSpecialist} <ChevronRight size={20} />
            </button>
          </Link>
        </div>
        
        <button 
          onClick={() => setQuotaExceeded(false)}
          style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'var(--amber-600)', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          ← {t.diagnosis.tool.newDiagnosis}
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="reveal active stagger-1" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button 
          onClick={() => setResult(null)}
          className="btn" 
          style={{ marginBottom: '1.5rem', background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
        >
          <ArrowLeft size={16} /> {t.diagnosis.tool.newDiagnosis}
        </button>
        <DiagnosisResult diagnosis={result} />
      </div>
    );
  }

  return (
    <div className="glass-panel reveal active" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '1.25rem', background: 'var(--accent-soft)', color: 'var(--accent-color)', marginBottom: '1.25rem', position: 'relative' }}>
          <Sparkles size={36} strokeWidth={1.5} />
          {remainingUses !== null && (
            <div style={{ position: 'absolute', top: '-10px', right: '-40px', background: 'var(--accent-color)', color: 'black', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 800, boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
              {t.diagnosis.tool.remaining}: {remainingUses} / 5
            </div>
          )}
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{t.diagnosis.tool.title}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: 500 }}>{t.diagnosis.tool.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {/* Step 1: Upload */}
        <div>
          <label style={{ display: 'block', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{t.diagnosis.tool.step1}</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              height: '350px', 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: preview ? 'black' : 'var(--bg-secondary)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => !preview && (e.currentTarget.style.borderColor = 'var(--accent-color)')}
            onMouseOut={(e) => !preview && (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
                  {t.diagnosis.tool.replaceHint}
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: '2rem', borderRadius: '50%', background: 'var(--surface-1)', boxShadow: 'var(--shadow-lg)', color: 'var(--accent-color)', transition: '0.3s' }} className="icon-pulse">
                  <Camera size={40} strokeWidth={1.5} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>{t.diagnosis.tool.uploadHint}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t.diagnosis.tool.uploadFormatHint}</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
        </div>

        {/* Step 2: Category */}
        <div>
          <label style={{ display: 'block', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{t.diagnosis.tool.step2}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '1.5rem 1rem',
                  borderRadius: '1.5rem',
                  border: '2px solid',
                  borderColor: category === cat.id ? 'var(--accent-color)' : 'var(--border-color)',
                  background: category === cat.id ? 'var(--accent-soft)' : 'var(--surface-1)',
                  color: category === cat.id ? 'var(--accent-color)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: category === cat.id ? 900 : 700,
                  boxShadow: category === cat.id ? 'var(--shadow-md)' : 'none',
                  transform: category === cat.id ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '1.75rem' }}>{cat.icon}</div>
                <span style={{ fontSize: '0.85rem', width: 'max-content' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Description */}
        <div>
          <label style={{ display: 'block', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{t.diagnosis.tool.step3}</label>
          <textarea 
            placeholder={t.diagnosis.tool.descriptionPlaceholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              height: '120px',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'none',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: 'var(--surface-1)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Strict Mode Toggle */}
        <div style={{ 
          background: strictMode ? 'var(--accent-soft)' : 'var(--surface-2)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid',
          borderColor: strictMode ? 'var(--accent-color)' : 'var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: strictMode ? 'var(--accent-color)' : 'var(--text-muted)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                {t.diagnosis?.tool?.strictMode || "Strict Vision Mode"}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {t.diagnosis?.tool?.strictModeHint || "High-fidelity visual reasoning (Deep analysis)"}
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setStrictMode(!strictMode)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              background: strictMode ? 'var(--accent-color)' : '#d1d5db',
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.3s'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: strictMode ? '27px' : '3px',
              transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>

        {error && (
          <div className="reveal active" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '1.25rem', background: '#fef2f2', color: '#b91c1c', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #fee2e2' }}>
            <AlertCircle size={24} /> {error}
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={loading || !preview || !category}
          className={`btn ${loading ? '' : 'btn-primary'}`}
          style={{ 
            width: '100%', 
            padding: '1.5rem', 
            fontSize: '1.1rem', 
            position: 'relative',
            overflow: 'hidden',
            opacity: (loading || !preview || !category) ? 0.6 : 1,
            cursor: (loading || !preview || !category) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <Loader2 className="animate-spin" size={24} />
              <span className="loading-dots">{t.diagnosis.tool.loading}</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {t.diagnosis.tool.submit} <ChevronRight size={20} />
            </div>
          )}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, padding: '0.5rem' }}>
          <Info size={16} style={{ verticalAlign: 'middle', marginRight: '6px', opacity: 0.7 }} /> 
          {t.diagnosis.tool.disclaimer}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-soft {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes dots {
          0% { content: '.'; }
          33% { content: '..'; }
          66% { content: '...'; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .icon-pulse {
          animation: pulse-soft 3s ease-in-out infinite;
        }
        .loading-dots::after {
          content: '.';
          animation: dots 1.5s steps(3, end) infinite;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
