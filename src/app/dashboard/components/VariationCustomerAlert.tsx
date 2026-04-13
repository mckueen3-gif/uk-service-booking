"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

export default function VariationCustomerAlert({ merchantName, serviceName, amount, mockDesc, mockPhoto }: { merchantName: string, serviceName: string, amount: string, mockDesc: string, mockPhoto: string }) {
  const { t } = useTranslation();
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
    if (confirm(t.merchant.dashboard.variations.rejectConfirm)) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStatus("REJECTED");
      }, 1500);
    }
  };

  if (status === "APPROVED") {
    return (
      <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #facc15', backgroundColor: '#ecfdf5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CheckCircle2 size={32} color="#facc15" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46', marginBottom: '0.25rem' }}>{t.merchant.dashboard.variations.approveSuccessTitle.replace('{amount}', amount)}</h3>
          <p style={{ color: '#b8860b', fontSize: '0.9rem' }}>{t.merchant.dashboard.variations.approveSuccessDesc.replace('{merchantName}', merchantName)}</p>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #64748b', backgroundColor: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <XCircle size={32} color="#64748b" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', marginBottom: '0.25rem' }}>{t.merchant.dashboard.variations.rejectSuccessTitle}</h3>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>{t.merchant.dashboard.variations.rejectSuccessDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
         <div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {t.merchant.dashboard.variations.pendingAlert}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7f1d1d', marginBottom: '0.25rem' }}>{serviceName} - {t.merchant.dashboard.variations.proposalTitle}</h3>
            <p style={{ color: '#991b1b', fontSize: '0.9rem' }}>{merchantName} {t.merchant.dashboard.variations.initiatedChange}</p>
         </div>
         <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700 }}>
           {t.merchant.dashboard.variations.pendingStatus}
         </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
         <img src={mockPhoto} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #fca5a5' }} alt="Evidence" />
         <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              <strong>{t.merchant.dashboard.variations.proofLabel}</strong> {mockDesc}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.9rem', color: '#991b1b' }}>{t.merchant.dashboard.variations.authorizedAmountLabel}</span>
               <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>£{amount}</span>
            </div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
         <button 
           onClick={handleApprove}
           disabled={isProcessing}
           className="hover-scale" 
           style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', backgroundColor: '#facc15', color: 'white', fontWeight: 700, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)' }}
         >
           {isProcessing ? t.merchant.dashboard.variations.processingAuth : t.merchant.dashboard.variations.approveBtn}
         </button>
         <button 
           onClick={handleReject}
           disabled={isProcessing}
           className="hover-scale" 
           style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 600, border: '1px solid #f87171', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
         >
           {t.merchant.dashboard.variations.rejectBtn}
         </button>
      </div>
    </div>
  );
}
