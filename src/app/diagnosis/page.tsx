import { Metadata } from 'next';
import DiagnosisTool from '@/components/diagnosis/DiagnosisTool';
import { Sparkles, ArrowRight, ShieldCheck, Zap, PoundSterling } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Instant Diagnosis | ServiceHub UK',
  description: 'Get an instant AI-powered diagnosis and price estimate for your home or car repairs. Professional insights in seconds.',
};

export default function DiagnosisPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '6rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal active">
           <div style={{ 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: '0.75rem', 
             padding: '0.5rem 1.25rem', 
             background: 'var(--surface-1)', 
             borderRadius: '2rem', 
             boxShadow: 'var(--shadow-sm)',
             fontSize: '0.9rem',
             fontWeight: 800,
             color: 'var(--emerald-600)',
             marginBottom: '1.5rem',
             border: '1px solid var(--border-color)'
           }}>
             <Sparkles size={18} /> POWERED BY GEMINI AI
           </div>
           
           <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
             Professional Repairs <br />
             <span style={{ color: 'var(--emerald-600)' }}>Identified In Seconds</span>
           </h1>
           
           <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.7 }}>
             Skip the guesswork. Our AI analyzes your photos to provide instant insights, repair scopes, and fair UK price estimates before you book.
           </p>
        </div>

        {/* Main Tool */}
        <div className="stagger-1 reveal active" style={{ marginBottom: '6rem' }}>
          <DiagnosisTool />
        </div>

        {/* Features / Why AI? */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
           <div className="glass-panel stagger-2 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <Zap size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Instant Insights</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No more waiting for callbacks. Get a technical breakdown of the issue immediately after uploading.</p>
           </div>

           <div className="glass-panel stagger-3 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <PoundSterling size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Fair Market Pricing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>We use real-time UK service data to give you an accurate price range for your specific region.</p>
           </div>

           <div className="glass-panel stagger-4 reveal active" style={{ padding: '2rem', background: 'var(--surface-1)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: 'var(--accent-soft)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '1.5rem' }}>
                 <ShieldCheck size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Verified Booking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Once diagnosed, connect with the top 1% of UK experts who are specialized in your exact problem.</p>
           </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '6rem' }} className="reveal active">
          <Link href="/services">
             <button className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border-color)', padding: '1rem 3rem' }}>
               Browse All Services <ArrowRight size={20} />
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
