import { prisma } from "@/lib/prisma";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search,
  Briefcase,
  FileText,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";
import MerchantReviewActions from "./components/MerchantReviewActions";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    include: { 
      user: true,
      documents: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.03em' }}>
            專家授權中心 <span style={{ color: '#d4af37' }}>Elite Expert Hub</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: '#666', fontSize: '1.2rem', fontWeight: 500 }}>
              管理 ConciergeAI 專家資質，執行 <span style={{ color: '#f59e0b', fontWeight: 700 }}>AI 疑難件</span> 的人工終極覆核。
            </p>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#333' }} />
            <span style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Admin Terminal</span>
          </div>
        </div>
        <div style={{ 
          background: 'rgba(212, 175, 55, 0.05)', 
          border: '1px solid rgba(212, 175, 55, 0.2)', 
          padding: '1.25rem 2rem', 
          borderRadius: '20px', 
          color: '#d4af37', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          fontWeight: 900,
          boxShadow: '0 10px 30px -10px rgba(212, 175, 55, 0.15)'
        }}>
          <Briefcase size={24} /> 在線專家總數: {merchants.length}
        </div>
      </div>

      {/* Action Required Section */}
      {merchants.some(m => m.documents.some(d => d.status === 'UNDER_ADMIN_REVIEW' || d.status === 'PENDING')) && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldAlert color="#f59e0b" size={24} /> 待處理案件 (Requires Immediate Attention)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2.5rem' }}>
            {merchants
              .filter(m => m.documents.some(d => d.status === 'UNDER_ADMIN_REVIEW' || d.status === 'PENDING'))
              .map((merchant) => {
                const reviewDocs = merchant.documents.filter(d => d.status === 'UNDER_ADMIN_REVIEW');
                const pendingDocs = merchant.documents.filter(d => d.status === 'PENDING');
                
                return (
                  <div key={merchant.id} className="glass-panel" style={{ 
                    background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '28px', 
                    padding: '2.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px -15px rgba(0,0,0,0.5)'
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #f59e0b, transparent)' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                       <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{merchant.companyName}</h3>
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                         {reviewDocs.length > 0 && <span style={{ backgroundColor: '#f59e0b20', color: '#f59e0b', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 900, border: '1px solid #f59e0b40' }}>{reviewDocs.length} 待覆核</span>}
                         {pendingDocs.length > 0 && <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#999', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 900, border: '1px solid rgba(255,255,255,0.1)' }}>{pendingDocs.length} 待辨識</span>}
                       </div>
                    </div>

                    <MerchantReviewActions 
                      merchantId={merchant.id} 
                      isVerified={merchant.isVerified}
                      pendingDocuments={merchant.documents.filter(d => d.status === 'UNDER_ADMIN_REVIEW' || d.status === 'PENDING')}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* All Merchants Directory */}
      <div>
        <h2 style={{ color: '#444', fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          全體專家名錄 (Expert Directory)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
          {merchants.map((merchant) => (
            <div key={merchant.id} className="glass-panel" style={{ 
              background: 'rgba(15, 15, 15, 0.4)', 
              border: '1px solid rgba(255, 255, 255, 0.03)', 
              borderRadius: '24px', 
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>{merchant.companyName}</h3>
                  <p style={{ color: '#555', fontSize: '0.85rem' }}>{merchant.user.email}</p>
                </div>
                <div style={{ 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '10px', 
                  backgroundColor: merchant.isVerified ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${merchant.isVerified ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                  color: merchant.isVerified ? '#d4af37' : '#444',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  textTransform: 'uppercase'
                }}>
                  {merchant.isVerified ? 'PREMIER VERIFIED' : 'NOT VERIFIED'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20px, 1fr))', gap: '0.5rem' }}>
                {merchant.documents.map(doc => (
                  <div key={doc.id} title={`${doc.type}: ${doc.status}`} style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: doc.status === 'APPROVED' ? '#d4af37' : doc.status === 'UNDER_ADMIN_REVIEW' ? '#f59e0b' : '#222' 
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {merchants.length === 0 && (
        <div style={{ padding: '8rem', textAlign: 'center', color: '#333' }}>
          <Search size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>目前尚無專家入駐資料。</p>
        </div>
      )}
    </div>
  );
}
