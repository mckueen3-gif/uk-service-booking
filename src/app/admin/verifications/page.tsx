"use client";

import { useEffect, useState } from "react";
import { getVerificationQueue, approveVerification, rejectVerification } from "@/app/actions/admin_actions";
import { 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  User,
  Calendar,
  Fingerprint
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminVerifications() {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getVerificationQueue();
      setQueues(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      if (action === 'APPROVE') await approveVerification(id);
      else await rejectVerification(id);
      setQueues(queues.filter(q => q.id !== id));
    } catch (e) {
      alert("操作失敗，請重試");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.verifications.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>{t.admin.verifications.sub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '6rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="#d4af37" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem', color: '#94a3b8', fontWeight: 600 }}>正在讀取審核隊列...</p>
          </div>
        ) : queues.length === 0 ? (
          <div style={{ 
            padding: '6rem 3rem', 
            textAlign: 'center', 
            backgroundColor: '#ffffff', 
            borderRadius: '2rem', 
            border: '1px dashed rgba(184, 134, 11, 0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
          }}>
            <div style={{ marginBottom: '1.5rem', color: '#d4af37', opacity: 0.5 }}>
              <ShieldCheck size={64} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>一切已就緒</p>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>目前沒有待處理的資質審核請求</p>
          </div>
        ) : (
          queues.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '2rem', 
              border: '1px solid rgba(184, 134, 11, 0.08)', 
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
              display: 'grid',
              gridTemplateColumns: 'minmax(400px, 1.2fr) 0.8fr',
              minHeight: '450px'
            }}>
              {/* Left: Document Gallery */}
              <div style={{ padding: '2.5rem', borderRight: '1px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      padding: '0.6rem', 
                      borderRadius: '12px', 
                      backgroundColor: '#ffffff', 
                      color: '#d4af37',
                      boxShadow: '0 4px 12px rgba(184,134,11,0.1)',
                      border: '1px solid rgba(184,134,11,0.05)'
                    }}>
                      <FileText size={20} />
                    </div>
                    <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{t.admin.verifications.evidence}</h3>
                 </div>
                 
                 <div style={{ 
                   position: 'relative', 
                   borderRadius: '1.5rem', 
                   overflow: 'hidden', 
                   border: '1px solid rgba(0,0,0,0.05)', 
                   aspectRatio: '16/10', 
                   backgroundColor: '#000',
                   boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                 }}>
                   <img 
                     src={item.documentUrl} 
                     alt="Identity Document" 
                     style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                   />
                   <div style={{ 
                     position: 'absolute', 
                     top: '20px', 
                     right: '20px', 
                     padding: '8px 16px', 
                     borderRadius: '99px', 
                     backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                     backdropFilter: 'blur(8px)',
                     border: '1px solid rgba(212, 175, 55, 0.3)', 
                     color: '#d4af37', 
                     fontSize: '11px', 
                     fontWeight: 900, 
                     textTransform: 'uppercase',
                     letterSpacing: '0.05em'
                   }}>
                     {item.documentType}
                   </div>
                 </div>
              </div>

              {/* Right: AI extraction & Adjudication */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                   <div>
                     <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>{item.merchant?.companyName || item.merchant?.user?.name || "Premium Expert"}</h4>
                     <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>商戶證照審核 ID: {item.merchantId.slice(0, 12).toUpperCase()}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <p style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.admin.verifications.confidence}</p>
                     <p style={{ fontSize: '2.25rem', fontWeight: 900, color: item.aiConfidence > 0.8 ? '#10b981' : '#f59e0b', margin: 0, letterSpacing: '-0.03em' }}>{(item.aiConfidence * 100).toFixed(0)}%</p>
                   </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Fingerprint size={16} color="#d4af37" />
                    {t.admin.verifications.extraction}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                     <DataPoint label={t.admin.verifications.fullName || "Full Name (AI)"} value={item.aiExtraction?.fullName || "..."} />
                     <DataPoint label={t.admin.verifications.idNumber || "ID Number (AI)"} value={item.aiExtraction?.idNumber || "..."} />
                     <DataPoint label={t.admin.verifications.expiryDate || "Expiry Date"} value={item.aiExtraction?.expiryDate || "..."} />
                     <DataPoint label={t.admin.verifications.dob || "DOB"} value={item.aiExtraction?.dob || "..."} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                   <button 
                     onClick={() => handleAction(item.id, 'APPROVE')}
                     style={{ 
                       flex: 1, 
                       backgroundColor: '#0f172a', 
                       color: '#d4af37', 
                       border: 'none', 
                       padding: '1.1rem', 
                       borderRadius: '16px', 
                       fontWeight: 900, 
                       fontSize: '13px', 
                       textTransform: 'uppercase', 
                       letterSpacing: '0.05em', 
                       cursor: 'pointer', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       gap: '0.6rem',
                       transition: 'all 0.2s',
                       boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)'
                     }}
                   >
                     <CheckCircle2 size={18} />
                     核准資質
                   </button>
                   <button 
                     onClick={() => handleAction(item.id, 'REJECT')}
                     style={{ 
                       flex: 1, 
                       backgroundColor: '#ffffff', 
                       color: '#ef4444', 
                       border: '1.5px solid rgba(239, 68, 68, 0.15)', 
                       padding: '1.1rem', 
                       borderRadius: '16px', 
                       fontWeight: 800, 
                       fontSize: '13px', 
                       textTransform: 'uppercase', 
                       letterSpacing: '0.05em', 
                       cursor: 'pointer', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       gap: '0.6rem',
                       transition: 'all 0.2s'
                     }}
                   >
                     <XCircle size={18} />
                     拒絕申請
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function DataPoint({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: '14px', color: '#0f172a', margin: '2px 0 0 0', fontWeight: 800 }}>{value}</p>
    </div>
  );
}
