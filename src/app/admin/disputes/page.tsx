"use client";

import { useEffect, useState } from "react";
import { getDisputes } from "@/lib/actions/admin";
import { 
  Gavel, 
  Scale, 
  Image as ImageIcon, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

  useEffect(() => {
    async function load() {
      const data = await getDisputes();
      setDisputes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.admin.disputes.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>{t.admin.disputes.sub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#d4af37" style={{ margin: '0 auto' }} />
          </div>
        ) : disputes.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px dashed #e2e8f0' }}>
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>目前系統中沒有待處理的爭議案件</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div key={dispute.id} style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '1.5rem', 
              border: '1px solid #e2e8f0', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
              minHeight: '450px'
            }}>
              {/* Left: Case Content */}
              <div style={{ padding: '2.5rem', borderRight: '1px solid #f1f5f9' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                   <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>
                     <Gavel size={22} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>案件編號: {dispute.bookingId.slice(-8).toUpperCase()}</h3>
                     <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>關聯預訂: #{dispute.bookingId.slice(0, 8)}</p>
                   </div>
                 </div>

                 <div style={{ marginBottom: '2.5rem' }}>
                   <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <Scale size={14} />
                     {t.admin.disputes.reasoning}
                   </p>
                   <div style={{ padding: '1.5rem', borderRadius: '1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontSize: '14px', lineHeight: '1.7', position: 'relative' }}>
                      {dispute.aiReasoning || "AI 正在分析買賣雙方的通訊記錄與證據鏈..."}
                   </div>
                 </div>

                 <div>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ImageIcon size={14} />
                      {t.admin.disputes.gallery}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                       {(!dispute.evidence || dispute.evidence.length === 0) ? (
                         <div style={{ gridColumn: 'span 3', padding: '2rem', borderRadius: '12px', border: '1px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                           暫無上傳的證據圖像
                         </div>
                       ) : (
                         dispute.evidence.map((url: string, index: number) => (
                           <div key={index} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', aspectRatio: '1', backgroundColor: '#f8fafc' }}>
                             <img src={url} alt={`Evidence ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           </div>
                         ))
                       )}
                    </div>
                 </div>
              </div>

              {/* Right: Adjudication Panel */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfc' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{dispute.customer?.name || "用戶"}</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>連同專家: {dispute.merchant?.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <p style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t.admin.disputes.confidence}</p>
                       <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{(dispute.aiConfidence * 100).toFixed(0)}%</p>
                    </div>
                 </div>

                 <div style={{ flex: 1 }}>
                    <div style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                       <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{t.admin.disputes.verdict}</p>
                       <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                         {dispute.aiVerdict === 'REFUND' ? '建議處理：向客戶發起部分/全額退款' : '建議處理：駁回申請並向專家撥款'}
                       </p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                    <button style={{ backgroundColor: '#0f172a', color: '#d4af37', border: 'none', padding: '1.1rem', borderRadius: '12px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} />
                      採納 AI 建議並結算
                    </button>
                    <button style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                      人工介入審核
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
