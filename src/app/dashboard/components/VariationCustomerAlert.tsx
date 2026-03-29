"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";

export default function VariationCustomerAlert({ merchantName, serviceName, amount, mockDesc, mockPhoto }: { merchantName: string, serviceName: string, amount: string, mockDesc: string, mockPhoto: string }) {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    // Simulate Stripe Escrow Intent Creation
    setTimeout(() => {
      setIsProcessing(false);
      setStatus("APPROVED");
    }, 2000);
  };

  const handleReject = () => {
    if (confirm("拒絕後，師傅僅會履行原始報價範圍，或是取消並收取基礎車馬費 (Call-out Fee)。確定要拒絕嗎？")) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStatus("REJECTED");
      }, 1500);
    }
  };

  if (status === "APPROVED") {
    return (
      <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #10b981', backgroundColor: '#ecfdf5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CheckCircle2 size={32} color="#10b981" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', marginBottom: '0.25rem' }}>已成功授權追加費用 £{amount}</h3>
          <p style={{ color: '#047857', fontSize: '0.9rem' }}>資金已安全鎖入 Stripe 原廠 Escrow 資金池中，直到 {merchantName} 完成任務才會撥款。</p>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #64748b', backgroundColor: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <XCircle size={32} color="#64748b" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', marginBottom: '0.25rem' }}>已拒絕該筆費用變更</h3>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>系統已自動記錄此拒絕歷程。若雙方無法達成施工共識，系統將自動啟動爭議調解 (Dispute) 程序。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
         <div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ⚠️ 待處理的額外費用審查 (Variation Request)
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7f1d1d', marginBottom: '0.25rem' }}>{serviceName} - 現場追加提案</h3>
            <p style={{ color: '#991b1b', fontSize: '0.9rem' }}>{merchantName} 發起了變更</p>
         </div>
         <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700 }}>
           等待您的同意 (Pending)
         </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
         <img src={mockPhoto} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fca5a5' }} alt="Evidence" />
         <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              <strong>師傅強制舉證說明：</strong> {mockDesc}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.9rem', color: '#991b1b' }}>追加授權額度：</span>
               <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>£{amount}</span>
            </div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
         <button 
           onClick={handleApprove}
           disabled={isProcessing}
           className="hover-scale" 
           style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', fontWeight: 700, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}
         >
           {isProcessing ? "處理金流與授權中..." : "💳 同意並鎖定授權額度 (Approve & Escrow)"}
         </button>
         <button 
           onClick={handleReject}
           disabled={isProcessing}
           className="hover-scale" 
           style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 600, border: '1px solid #f87171', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
         >
           拒絕並進入客服調解 (Reject)
         </button>
      </div>
    </div>
  );
}
