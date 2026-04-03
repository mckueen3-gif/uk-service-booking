import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Eye,
  Search
} from "lucide-react";
import Link from "next/link";
import { VerificationButtons } from "./VerificationButtons";

export const dynamic = "force-dynamic";

export default async function VerificationsPage() {
  const pendingDocs = await prisma.merchantDocument.findMany({
    where: { status: { in: ["PENDING", "UNDER_ADMIN_REVIEW"] } },
    include: { merchant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '1.25rem', 
        border: '1px solid #e2e8f0', 
        marginBottom: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <ShieldCheck style={{ color: '#d4af37' }} size={20} />
            Expert Verification Queue
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Review licenses, insurance, and background checks manually.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Search merchants..." 
            style={{ 
              paddingLeft: '40px', 
              paddingRight: '16px', 
              paddingTop: '8px', 
              paddingBottom: '8px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.75rem', 
              fontSize: '14px', 
              color: '#0f172a',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingDocs.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', borderRadius: '1.5rem', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
             <CheckCircle2 size={48} style={{ margin: '0 auto', color: '#10b981', marginBottom: '1rem', opacity: 0.2 }} />
             <p style={{ color: '#94a3b8', fontSize: '1.125rem', fontWeight: 600 }}>No pending verifications found.</p>
          </div>
        ) : (
          pendingDocs.map((doc) => (
            <VerificationRow key={doc.id} doc={doc} />
          ))
        )}
      </div>
    </div>
  );
}

function VerificationRow({ doc }: any) {
  const isHighConfidence = doc.confidence && doc.confidence > 0.8;
  
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      border: '1px solid #e2e8f0', 
      borderRadius: '1.25rem', 
      padding: '1.5rem', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, backgroundColor: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', textTransform: 'uppercase' }}>
                {doc.type.replace('_', ' ')}
              </span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '99px', 
                fontSize: '10px', 
                fontWeight: 800, 
                textTransform: 'uppercase',
                backgroundColor: doc.status === 'PENDING' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                color: doc.status === 'PENDING' ? '#f97316' : '#3b82f6',
                border: doc.status === 'PENDING' ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(59,130,246,0.2)'
              }}>
                {doc.status.replace('_', ' ')}
              </span>
            </div>
            <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '1.125rem' }}>{doc.merchant.companyName}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Submitted: {format(new Date(doc.createdAt), 'yyyy-MM-dd HH:mm')}</p>
          </div>
        </div>

        {/* AI Insight Bridge - Physical Background */}
        <div style={{ 
          flex: 1, 
          maxWidth: '440px', 
          padding: '1rem', 
          borderRadius: '1rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Extraction Result</span>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '10px', 
              fontWeight: 800, 
              padding: '2px 6px', 
              borderRadius: '4px',
              backgroundColor: isHighConfidence ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isHighConfidence ? '#10b981' : '#ef4444'
            }}>
              {Math.round((doc.confidence || 0) * 100)}% Confidence
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
               <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Reg #</p>
               <p style={{ fontSize: '14px', fontFamily: 'monospace', color: '#334155', fontWeight: 700, margin: '2px 0 0 0' }}>{doc.registrationNumber || 'NOT FOUND'}</p>
             </div>
             <div>
               <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Expiry</p>
               <p style={{ 
                 fontSize: '14px', 
                 fontWeight: 800, 
                 margin: '2px 0 0 0',
                 color: doc.expiryDate && new Date(doc.expiryDate) < new Date() ? '#ef4444' : '#0f172a'
               }}>
                 {doc.expiryDate ? format(new Date(doc.expiryDate), 'yyyy-MM-dd') : 'UNKNOWN'}
               </p>
             </div>
          </div>
        </div>

        {/* Action Center Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link 
            href={doc.fileUrl} 
            target="_blank"
            style={{ 
              padding: '12px 20px', 
              backgroundColor: '#ffffff', 
              border: '1px solid #d4af37', 
              borderRadius: '0.75rem', 
              color: '#d4af37', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '14px', 
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            <Eye size={16} /> Inspect
          </Link>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0', margin: '0 8px' }}></div>
          <VerificationButtons documentId={doc.id} />
        </div>
      </div>
    </div>
  );
}
