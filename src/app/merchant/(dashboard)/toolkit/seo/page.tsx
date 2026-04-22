"use client";

import { useState } from "react";
import { 
  Search, 
  ArrowLeft, 
  TrendingUp, 
  Globe, 
  Tag, 
  Sparkles,
  Loader2,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SEOExpertPage() {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 3000);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
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
              {t?.merchant?.toolkit?.seo?.title || "SEO Profile Optimization"}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t?.merchant?.toolkit?.seo?.desc || "Boost Google rankings & optimize metadata"}
            </p>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t?.merchant_dashboard?.tools?.seo?.badge || "FREE"}
          </div>
        </div>
      </header>

      {!analyzed ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            backgroundColor: 'var(--surface-1)', 
            borderRadius: '32px', 
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '30px', 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <Search size={48} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', inset: '-10px', border: '2px dashed rgba(245, 158, 11, 0.3)', borderRadius: '40px' }}
            />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{t?.merchant?.toolkit?.seo?.hero_title || "Rank Higher. Grow Faster."}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            {t?.merchant?.toolkit?.seo?.hero_desc || "Our AI SEO Expert analyzes your profile and services to ensure they are fully optimized for Google search and ConciergeAI's internal ranking algorithm."}
          </p>

          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            style={{ 
              padding: '1.25rem 3rem', 
              borderRadius: '20px', 
              backgroundColor: 'var(--text-primary)', 
              color: 'var(--bg-primary)',
              border: 'none',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
          >
            {analyzing ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            {analyzing ? (t?.merchant?.toolkit?.seo?.analyzing || "Analyzing Profile Data...") : (t?.merchant?.toolkit?.seo?.run_audit || "Run AI SEO Audit")}
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* SEO Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                backgroundColor: 'var(--surface-1)', 
                borderRadius: '24px', 
                border: '1px solid var(--border-color)',
                padding: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t?.merchant?.toolkit?.seo?.score_title || "Search Visibility Score"}</h3>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  border: '4px solid #10b981', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  color: '#10b981'
                }}>84%</div>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[
                  { label: t?.merchant?.toolkit?.seo?.scores?.completion || "Profile Completion", score: 100, color: "#10b981" },
                  { label: t?.merchant?.toolkit?.seo?.scores?.density || "Keyword Density", score: 65, color: "#f59e0b" },
                  { label: t?.merchant?.toolkit?.seo?.scores?.images || "Image Optimization", score: 90, color: "#10b981" },
                  { label: t?.merchant?.toolkit?.seo?.scores?.engagement || "Customer Engagement", score: 78, color: "#3b82f6" }
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 800 }}>{item.score}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ height: '100%', backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ 
                backgroundColor: 'var(--surface-1)', 
                borderRadius: '24px', 
                border: '1px solid var(--border-color)',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{t?.merchant?.toolkit?.seo?.checklist_title || "Optimization Checklist"}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  "Add 3 more technical keywords to your bio.",
                  "Enable 'Aura AI Secretary' to improve engagement metrics.",
                  "Request 2 more reviews for the 'Plumbing' category.",
                  "Update your service area postcodes for local SEO."
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: '#f59e0b' }}><TrendingUp size={18} /></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.1)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#d4af37' }}>
                <Sparkles size={20} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{t?.merchant?.toolkit?.seo?.auto_title || "AI Auto-Calibrate"}</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {t?.merchant?.toolkit?.seo?.auto_desc || "Let our AI automatically update your profile metadata to match current search trends in your sector."}
              </p>
              <button style={{ 
                width: '100%', 
                padding: '0.85rem', 
                borderRadius: '12px', 
                backgroundColor: 'var(--text-primary)', 
                color: 'var(--bg-primary)', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                cursor: 'pointer' 
              }}>
                {t?.merchant?.toolkit?.seo?.apply_auto || "Apply Auto-Optimizations"}
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>{t?.merchant?.toolkit?.seo?.global_title || "Global Reach"}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Globe size={16} /> <span>{t?.merchant?.toolkit?.seo?.indexed || "Indexed on Google UK"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}>
                <TrendingUp size={16} /> <span>{t?.merchant?.toolkit?.seo?.traffic || "+12% Traffic last 30d"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
