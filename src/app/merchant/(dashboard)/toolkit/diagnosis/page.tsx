"use client";

import DiagnosisTool from "@/components/diagnosis/DiagnosisTool";
import { useTranslation } from "@/components/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MerchantDiagnosisPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <Link 
          href="/merchant/toolkit"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-color)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} /> {t?.merchant?.toolkit?.back || "Back to Toolkit"}
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {t?.merchant?.toolkit?.diagnosis?.title || "AI Intelligent Diagnosis"}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t?.merchant?.toolkit?.diagnosis?.desc || "Visual damage assessment & lead capture system"}
            </p>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#d4af37',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t?.merchant_dashboard?.tools?.diagnosis?.badge || "FREE"}
          </div>
        </div>
      </header>

      <div className="diagnosis-container" style={{ position: 'relative', zIndex: 1 }}>
        <DiagnosisTool />
      </div>

      <style jsx>{`
        .diagnosis-container :global(.glass-panel) {
          margin: 0 !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
