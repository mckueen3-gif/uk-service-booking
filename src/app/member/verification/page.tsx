"use client";

import { useState } from "react";
import { UploadCloud, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import { verifyLicenseImage } from "@/app/actions/verification";

export default function VerificationPage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isValid: boolean, documentType: string, reason: string } | null>(null);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setResult(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setLoading(true);
    setError("");
    setResult(null);

    const res = await verifyLicenseImage(preview);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success && res.data) {
      setResult(res.data);
    }
  };

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t?.verification?.title || "AI Autonomous Audit Center"}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t?.verification?.subtitle || "Upload your professional license or identity documents. Our visual engine will automatically recognize and verify your status."}</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        
        {/* Upload Box */}
        <label style={{ 
          width: '100%', maxWidth: '500px', height: '250px', 
          border: '2px dashed #cbd5e1', borderRadius: '12px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backgroundColor: preview ? '#f8fafc' : '#f1f5f9',
          overflow: 'hidden', position: 'relative', transition: 'border-color 0.2s'
        }}>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={loading} />
          
          {preview ? (
            <img src={preview} alt="Selected document" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <>
              <UploadCloud size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t?.verification?.upload?.prompt || "Click or drag to upload image"}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t?.verification?.upload?.specs || "Supports JPG, PNG (Max 5MB)"}</div>
            </>
          )}
        </label>

        {preview && !result && !error && (
           <button 
             onClick={handleSubmit} 
             disabled={loading} 
             className="btn btn-primary" 
             style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}
           >
             {loading ? (t?.verification?.status?.analyzing || "Analyzing visual data...") : <><Sparkles size={18} /> {t?.verification?.submit || "Submit AI Verification"}</>}
           </button>
        )}

        {/* Error State */}
        {error && (
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              <strong>{t?.verification?.error?.title || "System Error:"}</strong><br /> {error}
            </div>
          </div>
        )}

        {/* AI Result State */}
        {result && (
          <div style={{ 
            width: '100%', maxWidth: '500px', padding: '1.5rem', borderRadius: '12px',
            backgroundColor: result.isValid ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${result.isValid ? '#a7f3d0' : '#fecaca'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               {result.isValid ? <CheckCircle2 size={24} color="#d4af37" /> : <XCircle size={24} color="#dc2626" />}
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: result.isValid ? '#065f46' : '#991b1b' }}>
                 {result.isValid ? (t?.verification?.result?.success || "Verified via AI") : (t?.verification?.result?.failed || "Verification Failed")}
               </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#334155' }}>
              <div><strong>{t?.verification?.result?.docTypeLabel || "Identified Document:"}</strong> {result.documentType}</div>
              <div><strong>{t?.verification?.result?.reasonLabel || "AI Reason:"}</strong> {result.reason}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
