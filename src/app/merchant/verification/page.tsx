"use client";

import { useState, useEffect } from "react";
import { uploadMerchantDocument, getMerchantDocuments } from "@/app/actions/merchant_documents";
import { ShieldCheck, FileText, Upload, CheckCircle2, AlertTriangle, Clock, Info, ExternalLink, Camera } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/LanguageContext";

export default function MerchantVerificationPage() {
  const { t } = useTranslation();
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
    const url = prompt(t?.verification?.upload?.simPrompt?.replace('{type}', type) || `Enter ${type} license image URL (mock upload):`, "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800");
    if (!url) return;

    setUploading(true);
    try {
      const res = await uploadMerchantDocument(type as any, url);
      if (res.success) {
        setMessage(t?.verification?.status?.submitted?.replace('{type}', type) || `✅ ${type} submitted for AI audit...`);
        setTimeout(loadDocuments, 3000); // Wait for AI processing
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>{t?.verification?.status?.loading || "Loading verification data..."}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t?.verification?.title || "Credential Verification"} <span style={{ color: 'var(--accent-color)' }}>Verification</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t?.verification?.subtitle || "Upload professional licenses to gain the 'Verified' badge and increase customer trust."}</p>
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
            <FileText size={20} color="var(--accent-color)" /> {t?.verification?.uploadedDocs?.replace('{count}', documents.length.toString()) || `Uploaded Documents (${documents.length})`}
          </h2>

          {documents.length === 0 ? (
            <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface-2)', borderRadius: '24px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
               <ShieldCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
               <p>{t?.verification?.empty || "No professional documents uploaded yet."}</p>
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
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t?.verification?.labels?.uploadedAt?.replace('{date}', new Date(doc.createdAt).toLocaleDateString()) || `Uploaded on ${new Date(doc.createdAt).toLocaleDateString()}`}</p>
                    </div>
                    <span style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem', 
                      fontWeight: 900,
                      backgroundColor: doc.status === 'APPROVED' ? 'rgba(212, 175, 55, 0.15)' : 
                                     doc.status === 'UNDER_ADMIN_REVIEW' ? 'rgba(245, 158, 11, 0.15)' : 
                                     'rgba(239, 68, 68, 0.15)',
                      color: doc.status === 'APPROVED' ? '#d4af37' : 
                             doc.status === 'UNDER_ADMIN_REVIEW' ? '#f59e0b' : 
                             '#ef4444',
                      border: `1px solid ${
                        doc.status === 'APPROVED' ? 'rgba(212, 175, 55, 0.3)' : 
                        doc.status === 'UNDER_ADMIN_REVIEW' ? 'rgba(245, 158, 11, 0.3)' : 
                        'rgba(239, 68, 68, 0.3)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {doc.status === 'UNDER_ADMIN_REVIEW' && <Clock size={14} />}
                      {doc.status === 'APPROVED' ? (t?.verification?.status?.approved || 'Approved') : 
                       doc.status === 'UNDER_ADMIN_REVIEW' ? (t?.verification?.status?.adminReview || 'Under Admin Review') : 
                       doc.status === 'PENDING' ? (t?.verification?.status?.pending || 'AI Evaluating') : (t?.verification?.status?.rejected || 'Rejected')}
                    </span>
                  </div>

                  {doc.status === 'UNDER_ADMIN_REVIEW' && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem 1rem', 
                      backgroundColor: 'rgba(245, 158, 11, 0.05)', 
                      border: '1px dashed rgba(245, 158, 11, 0.3)', 
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      color: '#f59e0b',
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'flex-start'
                    }}>
                      <Info size={16} />
                      <span><strong>{t?.verification?.status?.aiHint || "AI Hint:"}</strong> {t?.verification?.status?.aiConflict || "Document results are disputed or blurry. We have assigned a senior admin for manual review (ETR 24h)."}</span>
                    </div>
                  )}

                  {doc.aiAnalysis && (
                    <div style={{ backgroundColor: 'var(--surface-1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '1rem', fontSize: '0.85rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: '#d4af37' }}>{t?.verification?.insights?.title || "AI Insights"}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t?.verification?.insights?.confidence || "Confidence"}: {(doc.confidence * 100).toFixed(0)}%</span>
                       </div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                          <div>{t?.verification?.insights?.regNo || "Reg No:"} <strong>{doc.registrationNumber || (t?.verification?.insights?.pending || "Identifying...")}</strong></div>
                          <div>{t?.verification?.insights?.expiry || "Expiry:"} <strong>{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : (t?.verification?.insights?.pending || "Identifying...")}</strong></div>
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
                <Upload size={20} /> {t?.verification?.upload?.title || "Upload New Credential"}
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1.5rem' }}>{t?.verification?.upload?.desc || "Select document type and upload a clear photo. AI will extract key info."}</p>
              
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
                  <Camera size={18} /> {t?.verification?.types?.liability || "Public Liability Insurance"}
                </button>
              </div>
            </div>

             <div style={{ backgroundColor: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t?.verification?.rules?.title || "Audit Rules (UK Only)"}</h3>
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>{t?.verification?.rules?.validity || "Documents must be within validity period."}</span>
                  </li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>{t?.verification?.rules?.identity || "Name must match account holder or company."}</span>
                  </li>
                  <li style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                     <Info size={16} /> <span>{t?.verification?.rules?.timing || "AI audit typically completes within 5 mins."}</span>
                  </li>
               </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
