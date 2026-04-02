"use client";

import { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  FileText,
  BarChart3
} from "lucide-react";
import { reviewMerchantDocument } from "@/app/actions/admin_actions";

interface DocumentReviewModalProps {
  document: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DocumentReviewModal({ document, onClose, onSuccess }: DocumentReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!adminNotes && status === 'REJECTED') {
      alert("請輸入拒絕理由 (Please enter rejection reasons)");
      return;
    }

    setLoading(true);
    try {
      const res = await reviewMerchantDocument(document.id, status, adminNotes || "符合人工覆核標準");
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        height: '90vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: '#0a0a0a',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent)'
        }}>
          <div>
            <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 900 }}>
              <ShieldCheck color="#d4af37" /> 人工終極裁決 <span style={{ color: '#d4af37' }}>Adjudication Terminal</span>
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>專員覆核模式：正在審查 「{document.type}」 證照內容</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', overflow: 'hidden' }}>
          
          {/* Left: Document View */}
          <div style={{ padding: '2rem', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ flex: 1, border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
                <img 
                  src={document.fileUrl} 
                  alt="Document" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </div>
              <a 
                href={document.fileUrl} 
                target="_blank" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#d4af37', 
                  fontSize: '0.85rem', 
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={16} /> 點擊在新分頁開啟原始檔案 (Raw View)
              </a>
            </div>
          </div>

          {/* Right: AI Context & Decision Panel */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
            
            {/* AI Insights Section */}
            <section>
              <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} color="#d4af37" /> AI 預檢報告
              </h3>
              <div style={{ background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>AI 信心指數</div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(document.confidence || 0) * 100}%`, 
                      backgroundColor: (document.confidence || 0) > 0.8 ? '#10b981' : '#f59e0b',
                      boxShadow: `0 0 10px ${(document.confidence || 0) > 0.8 ? '#10b98140' : '#f59e0b40'}`
                    }} />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: (document.confidence || 0) > 0.8 ? '#10b981' : '#f59e0b', fontWeight: 900, marginTop: '0.4rem' }}>
                    {((document.confidence || 0) * 100).toFixed(0)}% Confidence
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', fontStyle: 'italic' }}>
                  「{document.aiAnalysis || "尚無 AI 分析資料"}」
                </div>
              </div>
            </section>

            {/* Extracted Data Section */}
            <section>
               <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#d4af37" /> 提取資料比對
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>註冊號碼 (Reg No.)</span>
                  <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>{document.registrationNumber || "無法辨識"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>有效期至 (Expiry)</span>
                  <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>
                    {document.expiryDate ? new Date(document.expiryDate).toLocaleDateString() : "未知"}
                  </span>
                </div>
              </div>
            </section>

            {/* Decision Input */}
            <section style={{ marginTop: 'auto' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#999', marginBottom: '0.75rem' }}>管理員裁決備註 (Admin Notes):</label>
              <textarea 
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="例如：圖片非常清晰、名字拼寫有細微落後、或文件已過期..."
                style={{ 
                  width: '100%', 
                  height: '100px', 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid #333', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  color: 'white',
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => handleReview('REJECTED')}
                  disabled={loading}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />} 拒絕核准
                </button>
                <button 
                  onClick={() => handleReview('APPROVED')}
                  disabled={loading}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
                    color: 'black', 
                    border: 'none', 
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} 准予通過
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
