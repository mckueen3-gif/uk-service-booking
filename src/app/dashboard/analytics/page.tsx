"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, Star, MessageSquare, Tag, 
  TrendingUp, ThumbsUp, ThumbsDown, Loader2,
  ArrowRight, Sparkles, MessageCircle
} from 'lucide-react';
import { getReviewAnalytics, submitMerchantReply } from "@/app/actions/analytics";
import { getReplyDrafts } from "@/app/actions/reply-assistant";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<string | null>(null);
  
  // New Optimization States
  const [filter, setFilter] = useState<string>("ALL"); // ALL, POSITIVE, NEUTRAL, NEGATIVE, UNREPLIED
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [drafting, setDrafting] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getReviewAnalytics();
    if (!res.error) setData(res);
    setLoading(false);
  }

  async function handleReply(reviewId: string) {
    setReplying(reviewId);
    const res = await submitMerchantReply(reviewId, replyText[reviewId]);
    if (res.success) {
      load();
    }
    setReplying(null);
  }

  async function handleGenerateDrafts(reviewId: string) {
    setDrafting(reviewId);
    const res = await getReplyDrafts(reviewId);
    if (res.drafts) {
      setDrafts({ ...drafts, [reviewId]: res.drafts });
    }
    setDrafting(null);
  }

  function applyDraft(reviewId: string, text: string) {
    setReplyText({ ...replyText, [reviewId]: text });
    setDrafts({ ...drafts, [reviewId]: null }); // Close drafts
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  if (!data) return <div>找不到分析資料 (No combined data)</div>;

  const filteredReviews = data.recentReviews.filter((r: any) => {
    if (filter === "ALL") return true;
    if (filter === "UNREPLIED") return !r.reply;
    return r.sentiment === filter;
  });

  const mPos = data.marketPosition;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>評論與數據分析 (Review Analytics)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>深入了解客人的回饋、情感傾向與市場競爭力</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Rating Distribution */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
             <BarChart3 size={24} color="var(--accent-color)" />
             <h2 style={{ fontWeight: 800 }}>評分分佈</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '3rem', fontWeight: 800 }}>{data.averageRating.toFixed(1)}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', color: '#f59e0b', marginBottom: '0.25rem' }}>
                   {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(data.averageRating) ? "currentColor" : "none"} />)}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>共 {data.totalReviews} 則評論</p>
             </div>
             
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.distribution.map((count: number, idx: number) => {
                  const star = 5 - idx;
                  const percentage = data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '15px' }}>{star}</span>
                       <div style={{ flex: 1, height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: star >= 4 ? '#facc15' : star === 3 ? '#6366f1' : '#f59e0b', borderRadius: '4px' }}></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Market Position (Phase 17+ Optimization) */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={20} color="var(--accent-color)" />
              <h2 style={{ fontWeight: 800 }}>市場競爭力 (Market Position)</h2>
           </div>
           
           <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>您的市場排名：</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                 Top <span style={{ color: 'var(--accent-color)' }}>{100 - mPos.percentile}%</span> 的 {mPos.mainCategory} 商戶
              </div>
           </div>

           <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                 <span color="var(--text-secondary)">同行平均評分：</span>
                 <span style={{ fontWeight: 700 }}>{mPos.categoryAvg.toFixed(1)} <Star size={12} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline', marginBottom: '2px' }} /></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                 <span color="var(--text-secondary)">地區排名 (City Rank)：</span>
                 <span style={{ fontWeight: 700 }}>第 {mPos.rank} 名 / 共 {mPos.totalCategory} 家</span>
              </div>
           </div>
        </div>

        {/* AI Sentiment Summary */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(99, 102, 241, 0.05))' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Sparkles size={20} color="#facc15" />
              <h2 style={{ fontWeight: 800 }}>情感分析摘要</h2>
           </div>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', textAlign: 'center' }}>
                 <ThumbsUp size={20} color="#facc15" style={{ margin: '0 auto 0.25rem' }} />
                 <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>{data.sentiment.positiveCount}</h4>
                 <p style={{ fontSize: '0.7rem', color: '#facc15' }}>Positive</p>
              </div>
              <div style={{ flex: 1, padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', textAlign: 'center' }}>
                 <ThumbsDown size={20} color="#ef4444" style={{ margin: '0 auto 0.25rem' }} />
                 <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{data.sentiment.negativeCount}</h4>
                 <p style={{ fontSize: '0.7rem', color: '#ef4444' }}>Negative</p>
              </div>
           </div>
        </div>
      </div>

      {/* Key Traits Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
            <Tag size={18} color="var(--accent-color)" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>熱門特點：</span>
         </div>
         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {data.topKeywords.length > 0 ? data.topKeywords.map((k: string) => (
              <span key={k} style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                 #{k}
              </span>
            )) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>等候更多數據...</span>}
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
         <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <TrendingUp size={18} /> 月度趨勢與洞察
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
               您在 **{mPos.mainCategory}** 領域的評分目前高於同行平均水平 ({mPos.categoryAvg.toFixed(1)})。
               客戶最常提及 **{data.topKeywords[0] || "服務品質"}**，這正是您的核心競爭力。
            </p>
         </div>

         <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h3 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageCircle size={20} color="var(--accent-color)" /> 評論管理與 AI 助手
               </h3>
               
               {/* Filter Chips */}
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {["ALL", "POSITIVE", "NEGATIVE", "UNREPLIED"].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilter(f)}
                      style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        border: '1px solid var(--border-color)',
                        backgroundColor: filter === f ? 'var(--accent-color)' : 'transparent',
                        color: filter === f ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {f === "ALL" ? "全部" : f === "POSITIVE" ? "正面" : f === "NEGATIVE" ? "負面" : "待回覆"}
                    </button>
                  ))}
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {filteredReviews.length === 0 ? (
                 <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>沒有符合條件的評論</p>
               ) : (
                 filteredReviews.map((r: any) => (
                   <div key={r.id} style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                         <div style={{ display: 'flex', gap: '4px' }}>
                            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? "#f59e0b" : "none"} color="#f59e0b" />)}
                         </div>
                         <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {r.sentiment && (
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: r.sentiment === 'POSITIVE' ? '#facc15' : '#ef4444' }}>
                                 {r.sentiment}
                              </span>
                            )}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>"{r.comment}"</p>
                      
                      {r.keywords && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                           {r.keywords.split(',').map((k: string) => (
                             <span key={k} style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>#{k}</span>
                           ))}
                        </div>
                      )}

                      {r.reply ? (
                        <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(15, 118, 110, 0.05)', borderLeft: '3px solid #0f766e' }}>
                           <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f766e', marginBottom: '0.25rem' }}>您的回饋：</p>
                           <p style={{ fontSize: '0.85rem' }}>{r.reply}</p>
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                           <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <input 
                                className="input-field" 
                                placeholder="輸入公開回覆..." 
                                style={{ fontSize: '0.85rem', flex: 1 }}
                                value={replyText[r.id] || ""}
                                onChange={e => setReplyText({...replyText, [r.id]: e.target.value})}
                              />
                              <button 
                                 className="btn" 
                                 onClick={() => handleGenerateDrafts(r.id)}
                                 disabled={drafting === r.id}
                                 style={{ fontSize: '0.75rem', padding: '0.5rem', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}
                              >
                                 {drafting === r.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                              </button>
                              <button 
                                 className="btn btn-primary" 
                                 disabled={replying === r.id || !replyText[r.id]}
                                 onClick={() => handleReply(r.id)}
                                 style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}
                              >
                                 {replying === r.id ? "..." : "回覆"}
                              </button>
                           </div>

                           {/* AI Drafts Popover */}
                           {drafts[r.id] && (
                             <div className="glass-panel" style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 100, padding: '1rem', marginBottom: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid var(--accent-color)' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                   <Sparkles size={12} color="var(--accent-color)" /> AI 建議草稿：
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                   {Object.entries(drafts[r.id]).map(([tone, text]: [string, any]) => (
                                     <button 
                                       key={tone}
                                       onClick={() => applyDraft(r.id, text)}
                                       style={{ textAlign: 'left', padding: '0.6rem', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                                       className="hover-bright"
                                     >
                                        <strong style={{ textTransform: 'capitalize', color: 'var(--accent-color)' }}>{tone}:</strong> {text}
                                     </button>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      )}
                   </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
