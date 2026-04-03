"use client";

import { useEffect, useState } from "react";
import { getVerificationQueue, approveVerification, rejectVerification } from "@/lib/actions/admin";
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
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminVerifications() {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

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
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.admin.verifications.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>{t.admin.verifications.sub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#d4af37" style={{ margin: '0 auto' }} />
          </div>
        ) : queues.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px dashed #e2e8f0' }}>
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>目前沒有待處理的資質審核請求</p>
          </div>
        ) : (
          queues.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '1.5rem', 
              border: '1px solid #e2e8f0', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              minHeight: '400px'
            }}>
              {/* Left: Document Gallery */}
              <div style={{ padding: '2rem', borderRight: '1px solid #f1f5f9' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                   <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>
                     <FileText size={20} />
                   </div>
                   <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.admin.verifications.evidence}</h3>
                 </div>
                 
                 <div style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', border: '2px solid #f1f5f9', aspectRatio: '16/10', backgroundColor: '#000' }}>
                   <img 
                     src={item.documentUrl} 
                     alt="Identity Document" 
                     style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                   />
                   <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'rgba(5,5,5,0.85)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
                     {item.documentType}
                   </div>
                 </div>
              </div>

              {/* Right: AI extraction & Adjudication */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                   <div>
                     <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.merchant?.name}</h4>
                     <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>商戶 ID: {item.merchantId.slice(0, 12)}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <p style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t.admin.verifications.confidence}</p>
                     <p style={{ fontSize: '2rem', fontWeight: 900, color: item.aiConfidence > 0.8 ? '#10b981' : '#f59e0b', margin: 0 }}>{(item.aiConfidence * 100).toFixed(0)}%</p>
                   </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Fingerprint size={14} />
                    {t.admin.verifications.extraction}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                     <DataPoint label="姓名 (AI)" value={item.aiExtraction?.fullName || "未命中"} />
                     <DataPoint label="證件號 (AI)" value={item.aiExtraction?.idNumber || "未命中"} />
                     <DataPoint label="有效期" value={item.aiExtraction?.expiryDate || "未命中"} />
                     <DataPoint label="出生日期" value={item.aiExtraction?.dob || "未命中"} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                   <button 
                     onClick={() => handleAction(item.id, 'APPROVE')}
                     style={{ flex: 1, backgroundColor: '#0f172a', color: '#d4af37', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                   >
                     <CheckCircle2 size={16} />
                     核准資質
                   </button>
                   <button 
                     onClick={() => handleAction(item.id, 'REJECT')}
                     style={{ flex: 1, backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                   >
                     <XCircle size={16} />
                     拒絕
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
