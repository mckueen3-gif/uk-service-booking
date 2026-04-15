'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, ArrowLeft, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage({ params }: { params: { merchantId: string } }) {
  const [rating, setRating] = useState(5);
  const [quality, setQuality] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "white", padding: "100px 20px", textAlign: "center" }}>
        <CheckCircle2 size={80} color="#d4af37" style={{ marginBottom: "2rem" }} />
        <h1>評價提交成功！</h1>
        <p style={{ color: "#888", marginBottom: "3rem" }}>感謝您為社群共享您的真實回饋。</p>
        <Link href={`/merchant/${params.merchantId}`} style={{ background: "#d4af37", color: "black", padding: "1rem 3rem", borderRadius: "100px", fontWeight: 900, textDecoration: "none" }}>
          回到商戶主頁
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh", color: "white", padding: "60px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href={`/merchant/${params.merchantId}`} style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", textDecoration: "none", marginBottom: "40px", fontWeight: 600 }}>
          <ArrowLeft size={20} /> 返回商戶頁面
        </Link>
        
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem" }}>撰寫評價 (Write Review)</h1>
        <p style={{ color: "#888", marginBottom: "40px" }}>您的意見對我們和其他客戶都非常重要。請客觀描述您的服務體驗。</p>

        <div style={{ background: "#0a0a0a", padding: "40px", borderRadius: "24px", border: "1px solid rgba(212,175,55,0.15)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Overall Rating */}
            <div>
              <label style={{ display: "block", marginBottom: "12px", color: "#d4af37", fontWeight: 800 }}>總評積分 (Overall Rating)</label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Star size={32} fill={star <= rating ? "#d4af37" : "none"} color="#d4af37" />
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Scores */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
               <div>
                 <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>工作品質 (Quality of Work)</label>
                 <select value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: "100%", background: "#111", border: "1px solid #222", color: "white", padding: "12px", borderRadius: "12px" }}>
                   {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} / 5</option>)}
                 </select>
               </div>
               <div>
                 <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>可靠度 (Reliability)</label>
                 <select value={reliability} onChange={(e) => setReliability(Number(e.target.value))} style={{ width: "100%", background: "#111", border: "1px solid #222", color: "white", padding: "12px", borderRadius: "12px" }}>
                   {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} / 5</option>)}
                 </select>
               </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "12px", color: "white", fontWeight: 700 }}>分享您的詳細經驗 (Your Comments)</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="在此詳細描述專家的服務態度、準時情況、解決問題的能力..."
                style={{ width: "100%", height: "200px", background: "#111", border: "1px solid #222", color: "white", padding: "20px", borderRadius: "16px", outline: "none" }}
              />
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading || !comment}
              style={{ background: loading ? "#1a1a1a" : "#d4af37", color: "black", padding: "1.25rem", borderRadius: "100px", border: "none", fontWeight: 900, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> 提交精英評價</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
