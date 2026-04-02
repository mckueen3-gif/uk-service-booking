"use client";

import { useState } from "react";
import { 
  Star, MessageSquare, Loader2, 
  CheckCircle2, Wand2, Send, 
  Quote, Smile, ShieldCheck, 
  ThumbsUp, ThumbsDown, Hash
} from "lucide-react";
import { getReplyDrafts } from "@/app/actions/reply-assistant";
import { submitReply } from "@/app/actions/review";

interface ReviewManagerProps {
  review: any;
}

export default function ReviewManager({ review }: ReviewManagerProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState(review.reply || "");
  const [drafting, setDrafting] = useState(false);
  const [drafts, setDrafts] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateDrafts = async () => {
    setDrafting(true);
    const res = await getReplyDrafts(review.id);
    if (res.drafts) setDrafts(res.drafts);
    setDrafting(false);
  };

  const handleReplySubmit = async (content: string) => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await submitReply(review.id, content);
      if (res.success) {
        setShowReplyForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("回覆提交失敗");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sentimentColor = review.sentiment === 'POSITIVE' ? '#facc15' : review.sentiment === 'NEGATIVE' ? '#ef4444' : '#f59e0b';
  const keywords = review.keywords?.split(",") || [];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', marginBottom: '1.5rem' }}>
      
      {/* Review Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            {review.customer?.name?.[0] || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{review.customer?.name || "Anonymous"}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(review.createdAt).toLocaleDateString()} · 訂單 #{review.bookingId.slice(-6)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < review.rating ? "#eab308" : "none"} color={i < review.rating ? "#eab308" : "#94a3b8"} />
            ))}
          </div>
          <span style={{ fontSize: '0.7rem', backgroundColor: `${sentimentColor}20`, color: sentimentColor, padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 800, textTransform: 'uppercase' }}>
            AI {review.sentiment || 'NEUTRAL'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-primary)', fontStyle: 'italic', position: 'relative', paddingLeft: '1.5rem' }}>
          <Quote size={12} style={{ position: 'absolute', left: 0, top: 0, color: 'var(--text-secondary)', opacity: 0.5 }} />
          {review.comment}
        </p>
      </div>

      {/* AI Keywords */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {keywords.map((kw: string, i: number) => (
          <span key={i} style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Hash size={12} /> {kw.trim()}
          </span>
        ))}
      </div>

      {/* Reply Section */}
      {review.reply ? (
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.85rem' }}>
            <MessageSquare size={14} /> 您的回覆 (Merchant Reply)
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{review.reply}</p>
        </div>
      ) : showReplyForm ? (
        <div className="animate-fade-up" style={{ marginTop: '1.5rem', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '20px', border: '1.5px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>專業回覆撰寫 (Write Reply)</h4>
            <button 
              onClick={generateDrafts}
              disabled={drafting}
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
            >
              {drafting ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
              AI 智能草稿支援
            </button>
          </div>

          {drafts && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setReplyContent(drafts.professional)} style={{ textAlign: 'left', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>PROFESSIONAL</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{drafts.professional}</div>
              </button>
              <button onClick={() => setReplyContent(drafts.warm)} style={{ textAlign: 'left', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem' }}>WARM (親切)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{drafts.warm}</div>
              </button>
              <button onClick={() => setReplyContent(drafts.short)} style={{ textAlign: 'left', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CONCISE (簡潔)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{drafts.short}</div>
              </button>
            </div>
          )}

          <textarea 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="輸入您的專業回覆內容..."
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', minHeight: '120px', border: '1.5px solid var(--border-color)', marginBottom: '1.5rem', backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '1rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleReplySubmit(replyContent)} disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              確認並發送回覆
            </button>
            <button onClick={() => setShowReplyForm(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              取消 Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowReplyForm(true)}
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800 }}
        >
          <MessageSquare size={18} /> 回覆客戶評價 (Reply to Feedback)
        </button>
      )}
    </div>
  );
}
