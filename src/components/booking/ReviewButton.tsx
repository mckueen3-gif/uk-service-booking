"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2, X } from "lucide-react";
import { submitReview } from "@/app/actions/review";

interface ReviewButtonProps {
  bookingId: string;
  hasReview: boolean;
}

export default function ReviewButton({ bookingId, hasReview }: ReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (hasReview) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', justifyContent: 'center' }}>
        <CheckCircle2 size={16} /> 已評價 (Done)
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitReview(bookingId, { rating, comment });
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("提交失敗，請重試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary" 
        style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#eab308', borderColor: '#eab308', color: '#000' }}
      >
        <Star size={16} fill="#000" /> 寫評價 (Write Review)
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-scale-in" style={{ maxWidth: '450px', width: '100%', padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', position: 'relative', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>感謝您的評價！</h2>
                <p style={{ color: 'var(--text-secondary)' }}>AI 正在分析您的回饋並即時更新...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>評價這次服務</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>您的回饋將幫助其他社群成員，並讓專家獲得大數據分析。</p>

                {/* Star Rating */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                      className="hover-scale"
                    >
                      <Star 
                        size={40} 
                        fill={(hoveredRating || rating) >= star ? "#eab308" : "none"} 
                        color={(hoveredRating || rating) >= star ? "#eab308" : "var(--text-secondary)"} 
                        strokeWidth={2}
                      />
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>詳細評論 (Details)</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="分享您的體驗... (例如：師傅很準時、價格透明、修得很專業)"
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', minHeight: '120px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'none', fontSize: '1rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !comment.trim()}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 900, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "立即提交評價 Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
