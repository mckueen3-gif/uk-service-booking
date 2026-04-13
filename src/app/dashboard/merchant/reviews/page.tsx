"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import ReviewManager from "@/components/dashboard/merchant/ReviewManager";
import { getMerchantReviews } from "@/app/actions/review";
import { useTranslation } from "@/components/LanguageContext";

export default function MerchantReviewsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await getMerchantReviews();
        setData(res);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={48} color="#d4af37" />
    </div>
  );

  const { merchant, stats } = data || {};

  if (!merchant) return <div style={{ padding: '2rem', color: '#fff' }}>Merchant profile not found.</div>;

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{t.merchant.dashboard.merchant_reviews.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t.merchant.dashboard.merchant_reviews.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Star size={20} fill="#eab308" color="#eab308" />
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stats.avg}</span>
          </div>
        </div>
      </div>

      {/* Review Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{t.merchant.dashboard.merchant_reviews.total}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="var(--accent-color)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.total}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{t.merchant.dashboard.merchant_reviews.positive}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#facc15" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>{((stats.positive / (stats.total || 1)) * 100).toFixed(0)}%</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{t.merchant.dashboard.merchant_reviews.negative}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{stats.negative}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '1000px' }}>
        {merchant.reviews.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {t.merchant.dashboard.merchant_reviews.empty}
          </div>
        ) : (
          merchant.reviews.map((review: any) => (
            <ReviewManager key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
