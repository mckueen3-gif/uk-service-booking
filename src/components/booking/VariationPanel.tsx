"use client";

import { useState } from 'react';
import { respondToVariation, runAIArbiter } from '@/app/actions/dispute_arbiter';
import { Check, X, ShieldAlert, Cpu, ZoomIn, Info } from 'lucide-react';
import { VariationStatus } from '@prisma/client';

export default function VariationPanel({ bookingId, initialVariations, dispute }: { bookingId: string, initialVariations: any[], dispute?: any }) {
  const [variations, setVariations] = useState(initialVariations);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleResponse = async (vId: string, status: VariationStatus) => {
    setProcessingId(vId);
    const res = await respondToVariation(vId, status);
    if (res.success) {
      setVariations(prev => prev.map(v => v.id === vId ? { ...v, status } : v));
      if ((status as string) === 'DISPUTED') {
         // If just disputed, we might want to refresh to see the AI Arbiter start or results
         window.location.reload();
      }
    }
    setProcessingId(null);
  };

  const handleAIArbitration = async (vId: string) => {
    setProcessingId(vId);
    const res = await runAIArbiter(vId);
    if (res.success) {
      // Refresh to show the resolved state from DB
      window.location.reload();
    } else {
      alert("AI Arbitration Error: " + res.error);
    }
    setProcessingId(null);
  };

  if (!variations || variations.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={16} /> 服務變動與加價 (Service Variations)
      </h4>
      
      {variations.map((v) => (
        <div key={v.id} className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: 700, fontSize: '1rem' }}>{v.description}</span>
                   <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>+£{v.amount}</span>
                </div>
                
                {/* Photo Proof Thumbnail */}
                {v.photoUrl && (
                  <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                     <img src={v.photoUrl} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                        <ZoomIn size={16} color="white" />
                     </div>
                  </div>
                )}

                {/* Status: Pending Approval */}
                {v.status === VariationStatus.PENDING && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                      onClick={() => handleResponse(v.id, VariationStatus.APPROVED)}
                      disabled={!!processingId}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Check size={14} /> 接受 Approve
                    </button>
                    <button 
                      onClick={() => handleResponse(v.id, VariationStatus.DISPUTED)}
                      disabled={!!processingId}
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      <X size={14} /> 爭議 Dispute
                    </button>
                  </div>
                )}

                {/* Status: Disputed (Waiting for AI or User to trigger AI) */}
                {v.status === VariationStatus.DISPUTED && (!dispute || dispute.status !== 'RESOLVED') && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                        <Cpu size={16} /> 進入爭議處理程序
                     </div>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>系統已偵測到爭議。您可以啟動 AI 智能仲裁，系統將依據「人工保底、材料核核」原則進行裁決。</p>
                     <button 
                       onClick={() => handleAIArbitration(v.id)}
                       disabled={!!processingId}
                       className="btn btn-primary" 
                       style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.8rem', backgroundColor: '#6366f1' }}
                     >
                       {processingId === v.id ? 'AI 分析中...' : '啟動 AI 智能裁決 (Gemini 1.5)'}
                     </button>
                  </div>
                )}

                {/* Status: Resolved by AI */}
                {dispute && dispute.status === 'RESOLVED' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <Cpu size={18} /> AI 仲裁結果：{dispute.aiDecision}
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Info size={16} style={{ flexShrink: 0, marginTop: '0.1rem', color: 'var(--text-secondary)' }} />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                           {dispute.aiReasoning}
                        </p>
                     </div>
                     <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Check size={14} color="#10b981" /> 本裁決已根據工程進度與市場行情自動同步至帳單。
                     </div>
                  </div>
                )}

                {v.status === VariationStatus.APPROVED && (!dispute || dispute.status !== 'RESOLVED') && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Check size={16} /> 項目已核准並動工
                  </div>
                )}
                
                {v.status === VariationStatus.REJECTED && (!dispute || dispute.status !== 'RESOLVED') && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700 }}>
                    <ShieldAlert size={16} /> 此項目已被駁回。
                  </div>
                )}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}
