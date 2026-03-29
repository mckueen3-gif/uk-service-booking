"use client";

import { useState } from 'react';
import { Star, X } from 'lucide-react';

export default function ReviewButton({ 
  bookingId, 
  merchantId, 
  serviceName 
}: { 
  bookingId: string, 
  merchantId: string, 
  serviceName: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('請選擇星級評分');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, merchantId, rating, comment })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      
      onClose(); // Close and succeed
      window.location.reload(); // Quick refresh to update UI state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'opacity 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <Star size={14} fill="#b45309" /> 撰寫評價
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
       <div className="glass-panel" style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '500px', position: 'relative', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>撰寫服務評價</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>正在為「{serviceName}」提供意見回饋。</p>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>您對這次服務滿意嗎？</p>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
               {[1, 2, 3, 4, 5].map(star => (
                 <Star 
                   key={star} 
                   size={36} 
                   fill={(hoveredRating || rating) >= star ? "#f59e0b" : "transparent"} 
                   color={(hoveredRating || rating) >= star ? "#f59e0b" : "var(--border-color)"}
                   onMouseEnter={() => setHoveredRating(star)}
                   onMouseLeave={() => setHoveredRating(0)}
                   onClick={() => setRating(star)}
                   style={{ cursor: 'pointer', transition: 'all 0.1s' }}
                 />
               ))}
             </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>詳細評論 (選填)</label>
            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="分享您覺得這位專家表現優異或需要改進的地方..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
          </div>

          <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem' }}>
            {isSubmitting ? '送出中...' : '發布評價'}
          </button>
       </div>
    </div>
    )}
    </>
  );
}
