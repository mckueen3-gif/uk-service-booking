"use client";

import { useEffect, useState, use } from "react";
import { getDisputeDetails, overrideDisputeDecision, updateDisputeStatus } from "@/app/actions/admin_actions";
import { ResolutionDecision, DisputeStatus } from "@prisma/client";
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, ShieldAlert, FileText, Camera, User, Store, Scale, Info } from "lucide-react";
import Link from 'next/link';

export default function DisputeDetailPage({ params }: { params: Promise<{ disputeId: string }> }) {
  const { disputeId } = use(params);
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [overriding, setOverriding] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDispute();
  }, [disputeId]);

  async function loadDispute() {
    try {
      const data = await getDisputeDetails(disputeId);
      if (data) {
        setDispute(data);
        if (data.status === 'OPEN') {
          await updateDisputeStatus(disputeId, DisputeStatus.REVIEWING);
        }
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleOverride = async (decision: ResolutionDecision) => {
    if (!adminNotes.trim()) {
      alert("Please provide reason for override.");
      return;
    }
    setOverriding(true);
    try {
      const result = await overrideDisputeDecision(disputeId, decision, adminNotes);
      if (result.success) {
        setMessage("Decision overridden successfully!");
        loadDispute();
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setOverriding(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dispute details...</div>;
  if (!dispute) return <div style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>Dispute not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* Back Button */}
      <Link href="/admin/disputes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={18} />
        返回監管儀表板
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
               <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>案件審理 <span style={{ color: 'var(--accent-color)' }}>Review</span></h1>
               <p style={{ color: 'var(--text-muted)' }}>Case #{dispute.id.slice(-8).toUpperCase()} — {new Date(dispute.createdAt).toLocaleString()}</p>
             </div>
             <div style={{ 
               padding: '0.5rem 1rem', 
               borderRadius: '12px', 
               backgroundColor: dispute.status === 'RESOLVED' ? '#10b98120' : '#f59e0b20',
               color: dispute.status === 'RESOLVED' ? '#10b981' : '#f59e0b',
               border: `1px solid ${dispute.status === 'RESOLVED' ? '#10b98140' : '#f59e0b40'}`,
               fontWeight: 800
             }}>
               {dispute.status}
             </div>
          </div>
          
          {/* Dispute Context */}
          <section className="glass-panel" style={{ borderRadius: '24px', padding: '2rem', background: 'var(--surface-2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={24} color="var(--accent-color)" /> 爭議點概述 (Dispute core)
            </h2>
            <div style={{ backgroundColor: 'var(--surface-1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
               <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>{dispute.reason}</p>
            </div>
          </section>

          {/* AI Assessment with Improved UI */}
          <section className="glass-panel" style={{ 
            borderRadius: '24px', 
            padding: '2rem', 
            background: 'linear-gradient(135deg, var(--accent-soft) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '1px solid var(--accent-color)',
            opacity: 0.9
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldAlert size={24} /> AI 仲裁員初步評估
              </h2>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: 'var(--accent-color)', color: 'var(--text-contrast)', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>
                 GEMINI 1.5 FLASH
              </div>
            </div>
            
            <div style={{ backgroundColor: 'var(--surface-1)', padding: '1.5rem', borderRadius: '16px', color: 'var(--text-primary)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI 建議裁決:</span>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: '1.1rem',
                  color: dispute.aiDecision === 'FORCE_PAYOUT' ? '#ef4444' : '#10b981'
                }}>
                  {dispute.aiDecision}
                </span>
              </div>
              <div style={{ fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                {dispute.aiReasoning || "AI 正在分析證據影音�          {/* Evidence Split-View */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Camera size={24} color="var(--accent-color)" /> 兩造證據對照 (Evidence Split-View)
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               {/* Merchant Side */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--surface-3)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)' }}>商戶方 (Merchant Service Evidence)</div>
                  {dispute.booking.variations.map((v: any) => (
                    <div key={v.id} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-2)' }}>
                      <img src={v.photoUrl} alt="Variation proof" style={{ width: '100%', aspectRatio: '1.5', objectFit: 'cover' }} />
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>變更金額: £{v.amount}</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>說明: {v.description}</p>
                      </div>
                    </div>
                  ))}
               </div>

               {/* Customer Side */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>客戶方 (Customer Complaint Logs)</div>
                  {dispute.evidence.length > 0 ? dispute.evidence.map((ev: any) => (
                    <div key={ev.id} style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--border-color)' }}>
                       <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{ev.description || "無文字說明"}</p>
                       <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--accent-color)' }}>上傳時間: {new Date(ev.createdAt).toLocaleString()}</div>
                    </div>
                  )) : (
                    <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface-2)', borderRadius: '16px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
                       客戶尚未上傳補充證據內容
                    </div>
                  )}
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Actions with Decision Impact */}
        <aside>
          <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--surface-2)', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>當事人資訊</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <User size={24} color="var(--accent-color)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>客戶 (Customer)</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{dispute.booking.customer.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Store size={24} color="#a855f7" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>商戶 (Merchant)</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{dispute.booking.merchant.companyName}</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '24px', padding: '1.5rem', color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={20} color="var(--accent-color)" /> 人工介入覆核
              </h3>
              
              <textarea 
                placeholder="請輸入人工裁量理由 (必填)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={{ width: '100%', minHeight: '120px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-primary)', marginBottom: '1.5rem', resize: 'vertical', fontSize: '0.95rem' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>裁決選項預覽 (Decision Impact)</div>
                
                <button 
                  onClick={() => handleOverride(ResolutionDecision.REFUND_CUSTOMER)}
                  disabled={overriding}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' }}
                  className="hover-scale"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> 裁定：退回客戶</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>忽略加價，僅支付原始訂單額</div>
                </button>
                
                <button 
                  onClick={() => handleOverride(ResolutionDecision.FORCE_PAYOUT)}
                  disabled={overriding}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' }}
                  className="hover-scale"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18} /> 裁定：強制結算商戶</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>確認工時與零件合理，全額扣款</div>
                </button>
                
                <button 
                  onClick={() => handleOverride(ResolutionDecision.SPLIT_COST)}
                  disabled={overriding}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--accent-color)', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' }}
                  className="hover-scale"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Scale size={18} /> 裁定：雙方分擔</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>折衷處理，由商戶與客戶對半分</div>
                </button>
              </div>
              
              {message && <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--accent-soft)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--accent-color)', textAlign: 'center', fontWeight: 700 }}>{message}</div>}
            </div>
            
            <div style={{ padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               <Info size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 所有人工覆核決策將永久存檔，並作為 AI 仲裁員後續學習的樣本數據 (Fine-tuning sample)。
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
m', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#94a3b8' }}>
               <Info size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 所有人工覆核決策將永久存檔，並作為 AI 仲裁員後續學習的樣本數據 (Fine-tuning sample)。
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
