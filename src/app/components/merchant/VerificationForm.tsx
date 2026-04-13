"use client";

import { useState, useRef } from 'react';
import { Upload, FileCheck, ShieldAlert, Sparkles, Loader2, X, ImageIcon } from 'lucide-react';
import { submitDocumentForVerification } from '@/app/actions/merchant_verification';
import { useTranslation } from '@/components/LanguageContext';

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
  const { t, isRTL } = useTranslation();
  const [docType, setDocType] = useState(DocumentType.BUSINESS_LICENSE);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>(initialStatus?.documents || []);
  const [status, setStatus] = useState(initialStatus?.isVerified ? 'VERIFIED' : 'UNVERIFIED');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert(t.merchant.dashboard.verification.errorSize);
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert(t.merchant.dashboard.verification.errorType);
      return;
    }

    setSelectedFile(file);
    
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, show a placeholder
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert(t.merchant.dashboard.verification.uploadPlaceholder);
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64 data URL for the AI verification action
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const result = await submitDocumentForVerification(fileDataUrl, docType as any);
      
      if (result.success) {
        const newDoc = {
           type: docType,
           status: result.analysis?.isExpired ? 'EXPIRED' : (result.analysis?.isValid ? 'APPROVED' : 'REJECTED'),
           expiryDate: result.analysis?.expiryDate,
           registrationNumber: result.analysis?.registrationNumber
        };
        setDocuments([newDoc, ...documents]);
        if (result.analysis?.isValid && !result.analysis?.isExpired) setStatus('VERIFIED');
        // Clear uploaded file after successful submission
        clearFile();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert(t.merchant.dashboard.verification.errorSubmit);
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
        borderBottom: `6px solid ${status === 'VERIFIED' ? '#facc15' : 'var(--border-color)'}`,
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        {status === 'VERIFIED' ? (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#facc15', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <FileCheck size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#facc15' }}>{t.merchant.dashboard.verification.verified}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t.merchant.dashboard.verification.verifiedDesc}</p>
          </>
        ) : (
          <>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldAlert size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{t.merchant.dashboard.verification.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{t.merchant.dashboard.verification.unverifiedDesc}</p>
          </>
        )}
      </div>

      {/* Upload Form */}
      <form onSubmit={handleVerify} className="glass-panel" style={{ padding: '2rem', display: 'grid', gap: '1.5rem', marginBottom: '2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'inherit' }}>{t.merchant.dashboard.verification.uploadTitle}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
           <div>
             <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', textAlign: 'inherit' }}>{t.merchant.dashboard.verification.docType}</label>
             <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-secondary, #f5f5f5)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '0.75rem', 
                  color: 'inherit',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
             >
                <option value={DocumentType.BUSINESS_LICENSE}>{t.merchant.dashboard.verification.types.license}</option>
                <option value={DocumentType.GAS_SAFE}>{t.merchant.dashboard.verification.types.gas}</option>
                <option value={DocumentType.NICEIC}>{t.merchant.dashboard.verification.types.electric}</option>
                <option value={DocumentType.SIA_LICENSE}>{t.merchant.dashboard.verification.types.sia}</option>
                <option value={DocumentType.FOOD_HYGIENE}>{t.merchant.dashboard.verification.types.food}</option>
                <option value={DocumentType.CQC_REG}>{t.merchant.dashboard.verification.types.cqc}</option>
                <option value={DocumentType.DVLA_CPC}>{t.merchant.dashboard.verification.types.dvla}</option>
                <option value={DocumentType.DBS_CHECK}>{t.merchant.dashboard.verification.types.dbs}</option>
                <option value={DocumentType.PUBLIC_LIABILITY}>{t.merchant.dashboard.verification.types.insurance}</option>
             </select>
           </div>

           {/* Upload Area with Preview */}
           <div>
             <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t.merchant.dashboard.verification.uploadDesc}</label>
             
             {!selectedFile ? (
               /* Empty Upload Zone */
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 onDrop={handleDrop}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 style={{ 
                   border: `2px dashed ${dragOver ? 'var(--accent-color)' : 'var(--border-color)'}`, 
                   borderRadius: '1rem', 
                   padding: '2.5rem 2rem', 
                   textAlign: 'center',
                   cursor: 'pointer',
                   transition: 'all 0.3s ease',
                   backgroundColor: dragOver ? 'rgba(250, 204, 21, 0.05)' : 'rgba(255,255,255,0.02)'
                 }}
               >
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="image/*,.pdf"
                   style={{ display: 'none' }}
                   onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) handleFileSelect(file);
                   }}
                 />
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                   <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--accent-color)' }}>
                     <Upload size={32} />
                   </div>
                   <div>
                     <p style={{ fontWeight: 800, marginBottom: '0.2rem' }}>{t.merchant.dashboard.verification.dropzoneTitle}</p>
                     <p style={{ fontSize: '0.8rem' }}>{t.merchant.dashboard.verification.dropzoneDesc}</p>
                   </div>
                 </div>
               </div>
             ) : (
               /* File Selected Preview */
               <div style={{ 
                 border: '2px solid var(--accent-color)', 
                 borderRadius: '1rem', 
                 padding: '1.25rem', 
                 backgroundColor: 'rgba(250, 204, 21, 0.03)',
                 position: 'relative'
               }}>
                 {/* Remove button */}
                 <button 
                   type="button"
                   onClick={clearFile}
                   style={{ 
                     position: 'absolute', 
                     top: '0.75rem', 
                     right: '0.75rem', 
                     background: 'rgba(239, 68, 68, 0.15)', 
                     border: 'none', 
                     borderRadius: '50%', 
                     width: '28px', 
                     height: '28px', 
                     cursor: 'pointer',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: '#ef4444',
                     transition: 'all 0.2s ease'
                   }}
                 >
                   <X size={14} />
                 </button>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   {/* Thumbnail or Icon */}
                   {previewUrl ? (
                     <div style={{ 
                       width: '70px', 
                       height: '70px', 
                       borderRadius: '0.5rem', 
                       overflow: 'hidden', 
                       flexShrink: 0,
                       border: '1px solid var(--border-color)'
                     }}>
                       <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                   ) : (
                     <div style={{ 
                       width: '70px', 
                       height: '70px', 
                       borderRadius: '0.5rem', 
                       backgroundColor: 'rgba(255,255,255,0.05)', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       flexShrink: 0,
                       color: 'var(--accent-color)'
                     }}>
                       <ImageIcon size={28} />
                     </div>
                   )}

                   {/* File Info */}
                   <div style={{ flex: 1, minWidth: 0 }}>
                     <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       {selectedFile.name}
                     </p>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                       {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                     </p>
                     <div style={{ 
                       marginTop: '0.4rem',
                       display: 'inline-flex',
                       alignItems: 'center',
                       gap: '0.3rem',
                       padding: '0.15rem 0.5rem',
                       borderRadius: '4px',
                       backgroundColor: 'rgba(16, 185, 129, 0.1)',
                       color: '#10b981',
                       fontSize: '0.7rem',
                       fontWeight: 700
                     }}>
                       <FileCheck size={12} /> {t.merchant.dashboard.verification.fileReady}
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>

           <div style={{ marginTop: '0.5rem' }}>
             <button 
                type="submit" 
                disabled={loading || !selectedFile}
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  fontWeight: 800, 
                  borderRadius: '0.75rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  fontSize: '1rem',
                  opacity: (!selectedFile && !loading) ? 0.5 : 1,
                  cursor: (!selectedFile && !loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? t.merchant.dashboard.verification.verifying : selectedFile ? t.merchant.dashboard.verification.uploadBtn : t.merchant.dashboard.verification.uploadPlaceholder}
              </button>
           </div>
        </div>
      </form>

      {/* Document History */}
      {documents.length > 0 && (
        <div className="glass-panel" style={{ padding: '2rem', direction: isRTL ? 'rtl' : 'ltr' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'inherit' }}>{t.merchant.dashboard.verification.history}</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {documents.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ opacity: 0.5 }}><FileCheck /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{doc.type.replace('_', ' ')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {doc.registrationNumber ? `${t.merchant.dashboard.verification.registrationNumber}: ${doc.registrationNumber}` : t.merchant.dashboard.verification.extracting}
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
                      {doc.expiryDate ? `${t.merchant.dashboard.verification.expiryDate}: ${new Date(doc.expiryDate).toLocaleDateString()}` : t.merchant.dashboard.verification.noExpiry}
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
