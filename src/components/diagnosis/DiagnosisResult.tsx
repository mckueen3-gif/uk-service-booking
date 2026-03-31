import { 
  CheckCircle2, AlertTriangle, PoundSterling, Clock, 
  MapPin, ShieldCheck, ChevronRight, Share2 
} from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";
import Link from 'next/link';

interface AIDiagnosisResult {
  id: string;
  category: string;
  issue: string;
  suggestedFix: string;
  estimatedPriceRange: string;
  confidence: number;
  imageUrl: string;
  createdAt: Date;
}

interface Props {
  diagnosis: AIDiagnosisResult;
}

export default function DiagnosisResult({ diagnosis }: Props) {
  const { t } = useTranslation();
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
              {t.diagnosis.tool.analyzedPhoto}
            </div>
          </div>

          {/* Diagnosis Content */}
          <div style={{ flex: '2 1 400px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {diagnosis.category} {t.nav.aiDiagnosis}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} /> {confidencePercent}% {t.diagnosis.tool.confidence}
              </div>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{t.diagnosis.tool.resultTitle}</h2>
            
            <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 {t.diagnosis.tool.detectedIssue}
              </h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{diagnosis.issue}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>{t.diagnosis.tool.recommendedSolution}</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{diagnosis.suggestedFix}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', background: 'var(--accent-soft)', borderRadius: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t.diagnosis.tool.estimatedCostLabel}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PoundSterling size={24} /> {diagnosis.estimatedPriceRange}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--accent-color)', opacity: 0.9, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t.diagnosis.tool.ukStandard}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{t.diagnosis.tool.includesLabor}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href={`/services/results?q=${diagnosis.category}`} style={{ flex: 2 }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  {t.diagnosis.tool.bookSpecialist} <ChevronRight size={20} />
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
          <div style={{ color: 'var(--accent-color)' }}><ShieldCheck size={32} /></div>
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{t.diagnosis.tool.guaranteedRepairs}</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.diagnosis.tool.disputeResolution}</p>
          </div>
        </div>
         <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div style={{ color: 'var(--accent-color)' }}><Clock size={32} /></div>
          <div>
            <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{t.diagnosis.tool.fastTurnaround}</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.diagnosis.tool.responseHours.replace('{category}', diagnosis.category.toLowerCase())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
