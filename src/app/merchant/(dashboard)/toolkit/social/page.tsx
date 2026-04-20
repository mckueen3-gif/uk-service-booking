"use client";

import { useState, useEffect } from "react";
import { 
  Share2, 
  Sparkles, 
  Rocket, 
  Crown, 
  Copy, 
  Check, 
  MessageSquare, 
  ArrowLeft,
  Loader2,
  Star,
  Quote
} from "lucide-react";

// Custom Icons for compatibility
const InstagramIcon = ({ size = 20, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 20, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

import { useTranslation } from "@/components/LanguageContext";
import { getMerchantReviews } from "@/app/actions/review";
import { generateSocialPost } from "@/app/actions/social_toolkit";
import Link from "next/link";

export default function SocialToolkitPage() {
  const { t } = useTranslation();
  const dict = (t as any).merchant.toolkit.social_toolkit;
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [mode, setMode] = useState<'viral' | 'luxury'>('viral');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getMerchantReviews();
      if (res.merchant?.reviews) {
        setReviews(res.merchant.reviews);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await generateSocialPost(mode, selectedReview || undefined);
    if (!res.error) {
      setPost(res);
    } else {
      alert(res.error);
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    if (!post) return;
    const text = `${post.headline}\n\n${post.caption}\n\n${post.suggestedHashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" size={32} color="#f472b6" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <Link 
        href="/merchant/toolkit"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> {t?.merchant?.toolkit?.back || "Back to Toolkit"}
      </Link>

      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <Share2 size={28} color="#f472b6" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{dict.title}</h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          {dict.desc}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Configuration Side */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Mode Selection */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Rocket size={18} color="#f472b6" /> {dict.modes.label}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                onClick={() => setMode('viral')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  border: mode === 'viral' ? '2px solid #f472b6' : '1px solid var(--border-color)',
                  backgroundColor: mode === 'viral' ? 'rgba(244, 114, 182, 0.1)' : 'var(--surface-1)',
                  color: mode === 'viral' ? '#f472b6' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>{dict.modes.viral}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{mode === 'viral' ? "High energy, viral hooks." : "High energy, viral hooks."}</div>
              </button>
              <button 
                onClick={() => setMode('luxury')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '20px',
                  border: mode === 'luxury' ? '2px solid #d4af37' : '1px solid var(--border-color)',
                  backgroundColor: mode === 'luxury' ? 'rgba(212, 175, 55, 0.1)' : 'var(--surface-1)',
                  color: mode === 'luxury' ? '#d4af37' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.25rem' }}>{dict.modes.luxury}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{mode === 'luxury' ? "Sophisticated, professional." : "Sophisticated, professional."}</div>
              </button>
            </div>
          </div>

          {/* Review Selection */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#f472b6" /> {dict.reviews.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{dict.reviews.subtitle}</p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto', 
              paddingBottom: '1rem',
              scrollbarWidth: 'none'
            }}>
              {reviews.filter(r => r.rating >= 4).map((r) => (
                <div 
                  key={r.id}
                  onClick={() => setSelectedReview(selectedReview === r.id ? null : r.id)}
                  style={{
                    minWidth: '240px',
                    backgroundColor: selectedReview === r.id ? 'var(--surface-2)' : 'var(--surface-1)',
                    padding: '1rem',
                    borderRadius: '16px',
                    border: selectedReview === r.id ? '1px solid #f472b6' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="#f472b6" color="#f472b6" />)}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                    "{r.comment}"
                  </p>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    — {r.customer?.name}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div style={{ padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', width: '100%' }}>
                  No 5-star reviews available to process yet.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              backgroundColor: '#f472b6',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 10px 20px rgba(244, 114, 182, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Generate Social Magic
          </button>
        </section>

        {/* Preview Side */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={18} color="#f472b6" /> {dict.preview.title}
          </h3>

          <div style={{ 
            backgroundColor: 'var(--surface-1)', 
            borderRadius: '28px', 
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            {post ? (
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                   <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '12px' }}>
                      {post.platform === 'Instagram' ? <InstagramIcon size={20} color="#f472b6" /> : <LinkedinIcon size={20} color="#0077b5" />}
                   </div>
                   <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                     Suggested for {post.platform}
                   </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem', color: '#f472b6' }}>{post.headline}</h4>
                
                <div style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  fontSize: '0.95rem', 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1.5rem',
                  position: 'relative'
                }}>
                  <Quote size={40} color="var(--border-color)" style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.2 }} />
                  {post.caption}
                  <div style={{ marginTop: '1rem', color: '#f472b6', fontWeight: 700 }}>
                    {post.suggestedHashtags.join(" ")}
                  </div>
                </div>

                {post.expertTip && (
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '1rem', borderRadius: '16px', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {dict.preview.expertTip}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      {post.expertTip}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleCopy}
                    style={{
                      flexGrow: 1,
                      padding: '1rem',
                      borderRadius: '16px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                    {copied ? dict.preview.copied : dict.preview.copyBtn}
                  </button>
                  <button 
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: '#25d366',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const text = `${post.headline}\n\n${post.caption}\n\n${post.suggestedHashtags.join(" ")}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                    }}
                  >
                    <MessageSquare size={24} />
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem' }}>
                  {dict.preview.shareHint}
                </p>
              </div>
            ) : (
              <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Sparkles size={48} color="var(--border-color)" style={{ marginBottom: '1.5rem' }} />
                <p>Select a mode and click "Generate" to see your social media assets appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        button:active {
          transform: scale(0.98);
        }
        ::-webkit-scrollbar {
          height: 0;
          width: 0;
        }
      `}</style>
    </div>
  );
}
