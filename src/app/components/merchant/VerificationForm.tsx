"use client";

import { useState } from 'react';
import { Upload, FileCheck, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { submitDocumentForVerification } from '@/app/actions/merchant_verification';

// Local enum-like objects to avoid Prisma Client generation sync issues in the UI
const DocumentType = {
  BUSINESS_LICENSE: 'BUSINESS_LICENSE',
  GAS_SAFE: 'GAS_SAFE',
  NICEIC: 'NICEIC',
  SIA_LICENSE: 'SIA_LICENSE',
  FOOD_HYGIENE: 'FOOD_HYGIENE',
  CQC_REG: 'CQC_REG',
  DVLA_CPC: 'DVLA_CPC',
  DBS_CHECK: 'DBS_CHECK',
  PUBLIC_LIABILITY: 'PUBLIC_LIABILITY'
};

export default function VerificationForm({ initialStatus }: { initialStatus: any }) {
  const [docType, setDocType] = useState(DocumentType.BUSINESS_LICENSE);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>(initialStatus?.documents || []);
  const [status, setStatus] = useState(initialStatus?.isVerified ? 'VERIFIED' : 'UNVERIFIED');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock URL for demo - assuming an upload happened
      const mockUrl = "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop";
      const result = await submitDocumentForVerification(mockUrl, docType as any);
      
      if (result.success) {
        // Refresh local state (Simulated refresh)
        const newDoc = {
           type: docType,
           status: result.analysis?.isExpired ? 'EXPIRED' : (result.analysis?.isValid ? 'APPROVED' : 'REJECTED'),
           expiryDate: result.analysis?.expiryDate,
           registrationNumber: result.analysis?.registrationNumber
        };
        setDocuments([newDoc, ...documents]);
        if (result.analysis?.isValid && !result.analysis?.isExpired) setStatus('VERIFIED');
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Current Status Hero */}
      <div className="glass-panel" style={{ 
        padding: '2.5rem', 
        marginBottom: '2rem', 
        textAlign: 'center',
        borderBottom: `6px solid ${status === 'VERIFIED' ? '#facc15' : 'var(--border-color)'}`
      }}>
        {status === 'VERIFIED' ? (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#facc15', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <FileCheck size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15' }}>已成功通過專家驗證！</h2>
            <p style={{ color: 'var(--text-secondary)' }}>您的專業標章已激活。請保持證書有效期以維持認證狀態。</p>
          </>
        ) : (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldAlert size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>完善您的專家合規性</h2>
            <p style={{ color: 'var(--text-secondary)' }}>上傳必要的執照與保險證明，解鎖更多平台權限。</p>
          </>
        )}
      </div>

      {/* Upload Form */}
      <form onSubmit={handleVerify} className="glass-panel" style={{ padding: '2rem', display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>上傳新憑證</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
           <div>
             <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>證書類型</label>
             <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'white' }}
             >
                <option value={DocumentType.BUSINESS_LICENSE}>營業執照 (Business License)</option>
                <option value={DocumentType.GAS_SAFE}>Gas Safe 註冊證</option>
                <option value={DocumentType.NICEIC}>NICEIC 電工認證</option>
                <option value={DocumentType.SIA_LICENSE}>SIA 安全人員執照</option>
                <option value={DocumentType.FOOD_HYGIENE}>食品衛生評級 (Food Hygiene)</option>
                <option value={DocumentType.CQC_REG}>CQC 醫療護理註冊</option>
                <option value={DocumentType.DVLA_CPC}>專業駕駛 CPC/DVLA</option>
                <option value={DocumentType.DBS_CHECK}>DBS 無犯罪紀錄證明</option>
                <option value={DocumentType.PUBLIC_LIABILITY}>公眾責任保險 (Insurance)</option>
             </select>
           </div>
           <div style={{ display: 'flex', alignItems: 'flex-end' }}>
             <button 
                type="submit" 
               disabled={loading}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', fontWeight: 800, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {loading ? "AI 審核中" : "上傳並驗證"}
              </button>
           </div>
        </div>
      </form>

      {/* Document History */}
      {documents.length > 0 && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>我的證書檔案</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {documents.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ opacity: 0.5 }}><FileCheck /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{doc.type.replace('_', ' ')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {doc.registrationNumber ? `編號: ${doc.registrationNumber}` : '正在提取資料...'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 900, 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: doc.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.1)' : 
                                       doc.status === 'EXPIRED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: doc.status === 'APPROVED' ? '#10b981' : 
                             doc.status === 'EXPIRED' ? '#ef4444' : '#f59e0b',
                      display: 'inline-block',
                      marginBottom: '0.3rem'
                   }}>
                     {doc.status}
                   </div>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                     {doc.expiryDate ? `有效期至: ${new Date(doc.expiryDate).toLocaleDateString()}` : '無過期資訊'}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
