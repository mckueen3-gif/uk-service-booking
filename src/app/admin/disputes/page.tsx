"use client";

import { useEffect, useState } from "react";
import { getAdminDisputes, updateDisputeStatus, overrideDisputeDecision } from "@/app/actions/admin_actions";
import { 
  Gavel, 
  Scale, 
  Image as ImageIcon, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getAdminDisputes();
      setDisputes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAction = async (id: string, decision: 'FORCE_PAYOUT' | 'REFUND_CUSTOMER') => {
    if (!confirm(`確定要將此案判定為 ${decision} 嗎？此操作不可撤銷。`)) return;
    try {
      await overrideDisputeDecision(id, decision as any, "Admin manual resolution from dashboard.");
      setDisputes(disputes.filter(d => d.id !== id));
    } catch (e) {
      alert("操作失敗");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      <div style={{ padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.disputes.title}</h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>{t.admin.disputes.sub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {loading ? (
          <div style={{ padding: '8rem 4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={48} color="#d4af37" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontWeight: 600 }}>載入爭議隊列中...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div style={{ 
            padding: '8rem 4rem', 
            textAlign: 'center', 
            backgroundColor: '#ffffff', 
            borderRadius: '2.5rem', 
            border: '1px dashed rgba(184, 134, 11, 0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
          }}>
            <div style={{ marginBottom: '1.5rem', color: '#d4af37', opacity: 0.3 }}>
              <Scale size={64} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 900 }}>平安無事</p>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontWeight: 500 }}>目前系統中沒有待處理的爭議案件</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div key={dispute.id} style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '2.5rem', 
              border: '1px solid rgba(184, 134, 11, 0.08)', 
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.05)',
              display: 'grid',
              gridTemplateColumns: 'minmax(400px, 1.2fr) 0.8fr',
              minHeight: '550px'
            }}>
              {/* Left: Case Content */}
              <div style={{ padding: '3rem', borderRight: '1px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                   <div style={{ 
                     padding: '0.75rem', 
                     borderRadius: '14px', 
                     backgroundColor: '#ffffff', 
                     color: '#d4af37',
                     boxShadow: '0 4px 15px rgba(184,134,11,0.12)',
                     border: '1px solid rgba(184,134,11,0.05)'
                   }}>
                     <Gavel size={24} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>CASE #{dispute.id.slice(-8).toUpperCase()}</h3>
                     <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>{dispute.booking?.service?.name || "未知服務"}</p>
                   </div>
                   <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '99px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '11px', fontWeight: 900 }}>
                     {dispute.status}
                   </div>
                 </div>

                 <div style={{ marginBottom: '3rem' }}>
                   <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                     <ShieldAlert size={16} color="#d4af37" />
                     {t.admin.disputes.reasoning}
                   </p>
                   <div style={{ 
                     padding: '2rem', 
                     borderRadius: '1.5rem', 
                     backgroundColor: '#ffffff', 
                     border: '1px solid rgba(0,0,0,0.04)', 
                     boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)',
                     color: '#334155', 
                     fontSize: '15px', 
                     lineHeight: '1.8',
                     whiteSpace: 'pre-wrap'
                   }}>
                      {dispute.aiReasoning || "AI 仲裁引擎正在彙整通訊記錄與交付物證據..."}
                   </div>
                 </div>

                 <div>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <ImageIcon size={16} color="#d4af37" />
                      {t.admin.disputes.gallery}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
                       {(!dispute.evidence || dispute.evidence.length === 0) ? (
                         <div style={{ gridColumn: 'span 3', padding: '3rem', borderRadius: '20px', border: '1px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
                           <FileText size={32} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                           尚未提交任何視覺證據
                         </div>
                       ) : (
                         dispute.evidence.map((ev: any, index: number) => (
                           <div key={index} style={{ 
                             borderRadius: '16px', 
                             overflow: 'hidden', 
                             border: '1px solid rgba(0,0,0,0.06)', 
                             aspectRatio: '1', 
                             backgroundColor: '#000',
                             cursor: 'zoom-in',
                             boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
                           }}>
                             <img src={ev.url} alt={`Evidence ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                           </div>
                         ))
                       )}
                    </div>
                 </div>
              </div>

              {/* Right: Adjudication Panel */}
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{dispute.booking?.customer?.name || "用戶"}</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>對陣專家: {dispute.booking?.merchant?.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <p style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{t.admin.disputes.confidence}</p>
                       <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                         {(dispute.aiConfidence ? dispute.aiConfidence * 100 : 0).toFixed(0)}<span style={{ fontSize: '1rem', fontWeight: 800 }}>%</span>
                       </p>
                    </div>
                 </div>

                 <div style={{ flex: 1 }}>
                    <div style={{ 
                      padding: '2rem', 
                      borderRadius: '2rem', 
                      backgroundColor: '#fafbfc', 
                      border: '1px solid rgba(184, 134, 11, 0.08)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                    }}>
                       <p style={{ fontSize: '11px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>{t.admin.disputes.verdict}</p>
                       <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: '1.6' }}>
                         {dispute.aiDecision === 'REFUND_CUSTOMER' ? '⚖️ 仲裁傾向：支持客戶，發起全額退款' : '🛡️ 仲裁傾向：支持專家，駁回爭議申請'}
                       </p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
                    <button 
                      onClick={() => handleAction(dispute.id, dispute.aiDecision || 'FORCE_PAYOUT')}
                      style={{ 
                        backgroundColor: '#0f172a', 
                        color: '#d4af37', 
                        border: 'none', 
                        padding: '1.25rem', 
                        borderRadius: '16px', 
                        fontWeight: 900, 
                        fontSize: '13px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.08em', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.75rem',
                        boxShadow: '0 15px 30px rgba(15, 23, 42, 0.15)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <CheckCircle2 size={20} />
                      採納仲裁建議並結案
                    </button>
                    
                    <button style={{ 
                      backgroundColor: '#ffffff', 
                      color: '#64748b', 
                      border: '1.5px solid #e2e8f0', 
                      padding: '1.1rem', 
                      borderRadius: '16px', 
                      fontWeight: 800, 
                      fontSize: '13px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.2s'
                    }}>
                      介入詳細審查內容
                      <ArrowUpRight size={16} />
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
