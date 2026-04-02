"use client";

import { useState } from "react";
import { Camera, AlertCircle, X, PoundSterling, CheckCircle2, FileText, Send } from "lucide-react";

export default function VariationMerchantButton({ bookingId }: { bookingId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to create Variation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setIsSuccess(false); setAmount(""); setDesc(""); }}
        className="hover-scale" 
        style={{ backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fcd34d', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
      >
        + 加價申請
      </button>

      {isOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="animate-fade-up glass-panel" style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            
            <button onClick={() => !isSubmitting && setIsOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>

            {isSuccess ? (
               <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                 <CheckCircle2 size={64} color="#facc15" style={{ margin: '0 auto 1.5rem' }} />
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>申請已發送！</h2>
                 <p style={{ color: 'var(--text-secondary)' }}>客戶已經收到 Email 通知與 App 彈窗。請等待對方同意後再進行額外施工與採購物料。</p>
               </div>
            ) : (
               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>發起額外費用申請</h2>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>請詳細說明追加原因，並強制提供照片佐證。所有申請皆受 200% 上限保護機制監管。</p>
                 </div>

                 {/* Photo Proof */}
                 <div>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                     <Camera size={16} /> 強制現場相片舉證 (Mandatory)
                   </label>
                   <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
                      <Camera size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>點擊上傳現場損壞照片</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>支援 JPG, PNG (最大 5MB)</div>
                   </div>
                 </div>

                 {/* Amount */}
                 <div>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                     <PoundSterling size={16} /> 追加總金額 (Amount)
                   </label>
                   <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="input-field" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} min="1" />
                 </div>

                 {/* Description */}
                 <div>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                     <FileText size={16} /> 追加原因說明 (Reason)
                   </label>
                   <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="請詳述為何需要追加物料或工時..." rows={4} className="input-field" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
                 </div>
                 
                 <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.8rem', color: '#b45309', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                   <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                   <span>請注意：在客戶點擊同意並透過 Stripe 成功圈存 (Escrow) 資金前，請勿代墊任何超過千鎊的材料費。</span>
                 </div>

                 <button type="submit" disabled={isSubmitting || !amount || !desc} className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                   {isSubmitting ? "發送中..." : <><Send size={18} /> 送出申請</>}
                 </button>
               </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
