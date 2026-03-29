"use client";

import { useState } from 'react';
import { Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { submitReview } from '@/app/actions/review';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ bookingId, merchantName }: { bookingId: string, merchantName: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating!");
    
    setLoading(true);
    try {
      await submitReview(bookingId, { rating, comment });
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/repair/${bookingId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <CheckCircle2 size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#10b981' }}>評價成功！</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>感謝您的回饋，正在為您跳轉...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center' }}>服務滿意度調查</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>為您在 {merchantName} 的體驗評分</p>

      {/* Star Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          >
            <Star 
              size={48} 
              fill={(hover || rating) >= star ? '#f59e0b' : 'none'} 
              color={(hover || rating) >= star ? '#f59e0b' : 'var(--border-color)'}
              style={{ transition: 'all 0.2s ease' }}
            />
          </button>
        ))}
      </div>

      {/* Comment Area */}
      <div style={{ marginBottom: '2.5rem' }}>
        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>寫下您的真實感受 (選填)</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="分享一下師傅的專業程度、守時情況或環境設施..."
          style={{ 
            width: '100%', 
            minHeight: '150px', 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '1rem', 
            padding: '1rem', 
            color: 'var(--text-primary)', 
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || rating === 0}
        className="btn btn-primary" 
        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
      >
        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        {loading ? "送出中..." : "提交評價並領取獎勵"}
      </button>

      <p style={{ textAlign: 'center', color: 'var(--accent-color)', fontSize: '0.85rem', marginTop: '1.5rem', fontWeight: 600 }}>
        評價後將自動記入您的會員積分，感謝支持優秀職人！
      </p>
    </form>
  );
}
