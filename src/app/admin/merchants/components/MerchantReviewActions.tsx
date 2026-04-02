"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, Loader2, Eye } from "lucide-react";
import DocumentReviewModal from "./DocumentReviewModal";

interface MerchantReviewActionsProps {
  merchantId: string;
  isVerified: boolean;
  pendingDocuments: any[];
}

export default function MerchantReviewActions({ 
  merchantId, 
  isVerified, 
  pendingDocuments 
}: MerchantReviewActionsProps) {
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  if (pendingDocuments.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 800 }}>
        <ShieldAlert size={18} /> 待辦事項：人工覆核程序 ({pendingDocuments.length})
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingDocuments.map((doc) => (
          <div key={doc.id} style={{ 
            background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.4) 0%, rgba(10, 10, 10, 0.6) 100%)',
            padding: '1.25rem', 
            borderRadius: '16px', 
            border: '1px solid rgba(212, 175, 55, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>{doc.type}</div>
              <div style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Confidence: {((doc.confidence || 0) * 100).toFixed(0)}%</div>
            </div>
            
            <button 
              onClick={() => setSelectedDoc(doc)}
              style={{ 
                padding: '0.6rem 1.2rem', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                color: '#d4af37', 
                border: '1px solid rgba(212, 175, 55, 0.3)', 
                fontSize: '0.75rem', 
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)')}
            >
              <Eye size={14} /> 開啟裁決終端
            </button>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <DocumentReviewModal 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
