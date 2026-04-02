"use client";

import { useState, useEffect } from "react";
import { uploadMerchantDocument, getMerchantDocuments } from "@/app/actions/merchant_documents";
import { ShieldCheck, FileText, Upload, CheckCircle2, AlertTriangle, Clock, Info, ExternalLink, Camera } from "lucide-react";
import Link from "next/link";

export default function MerchantVerificationPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const res = await getMerchantDocuments();
      if (res.documents) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (type: string) => {
    const url = prompt(`請輸入 ${type} 證照的圖片連結 (模擬上傳):`, "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800");
    if (!url) return;

    setUploading(true);
    try {
      const res = await uploadMerchantDocument(type as any, url);
      if (res.success) {
        setMessage(`✅ ${type} 已提交 AI 審核中...`);
        setTimeout(loadDocuments, 3000); // Wait for AI processing
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>載入認證資料中...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>商戶資質認證 <span style={{ color: 'var(--accent-color)' }}>Verification</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>上傳您的專業執照以獲得「已驗證」標章，提升客戶信任度與訂單量。</p>
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '12px', marginBottom: '2rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Document List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--accent-color)" /> 已上傳證件 ({documents.length})
          </h2>

          {documents.length === 0 ? (
            <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface-2)', borderRadius: '24px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
               <ShieldCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
               <p>您尚未上傳任何專業證件。</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} style={{ backgroundColor: 'var(--surface-2)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'black', flexShrink: 0 }}>
                  <img src={doc.fileUrl} alt="License" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{doc.type}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>於 {new Date(doc.createdAt).toLocaleDateString()} 上傳</p>
                    </div>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      backgroundColor: doc.status === 'APPROVED' ? '#facc1520' : '#f59e0b20',
                      color: doc.status === 'APPROVED' ? '#facc15' : '#f59e0b'
                    }}>
                      {doc.status}
                    </span>
                  </div>

                  {doc.aiAnalysis && (
                    <div style={{ backgroundColor: 'var(--surface-1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '1rem', fontSize: '0.85rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--accent-color)' }}>AI 提取資訊</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>信心度: {(doc.confidence * 100).toFixed(0)}%</span>
                       </div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                          <div>註冊號: <strong>{doc.registrationNumber || "辨識中"}</strong></div>
                          <div>有效期: <strong>{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "辨識中"}</strong></div>
                       </div>
                       <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>{doc.aiAnalysis}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Sidebar */}
        <aside>
          <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--accent-color)', borderRadius: '24px', padding: '1.5rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} /> 上傳新資質
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1.5rem' }}>請選擇證件類型並上傳清晰的照片。AI 將自動提取關鍵資訊。</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleUpload('GAS_SAFE')}
                  disabled={uploading}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Camera size={18} /> Gas Safe Register
                </button>
                <button 
                  onClick={() => handleUpload('NICEIC')}
                  disabled={uploading}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Camera size={18} /> NICEIC Certificate
                </button>
                <button 
                  onClick={() => handleUpload('PUBLIC_LIABILITY')}
                  disabled={uploading}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Camera size={18} /> 公共責任險 (Liability)
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>審核規則 (UK Only)</h3>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>證件必須在有效期內。</span>
                  </li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>證件姓名必須與帳戶姓名或公司名一致。</span>
                  </li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>AI 自動審核通常在 5 分鐘內完成。</span>
                  </li>
               </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
