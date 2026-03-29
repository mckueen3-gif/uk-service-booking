import { prisma } from "@/lib/prisma";
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Search,
  MoreVertical,
  Briefcase
} from "lucide-react";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>商戶審核 (Merchant Verification)</h1>
          <p style={{ color: '#94a3b8' }}>審核並管理入駐平台的服務商，確保服務品質。</p>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Briefcase size={18} /> 全部商戶: {merchants.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {merchants.map((merchant) => (
          <div key={merchant.id} style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '1.5rem', 
            padding: '1.5rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#6366f120', padding: '0.75rem', borderRadius: '1rem', color: '#6366f1' }}>
                <Briefcase size={24} />
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '0.25rem 0.6rem', 
                borderRadius: '0.5rem',
                backgroundColor: merchant.isVerified ? '#05966930' : '#ef444430',
                color: merchant.isVerified ? '#34d399' : '#f87171',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {merchant.isVerified ? '已認證' : '待審核'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>{merchant.companyName}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{merchant.user.email}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>完成訂單</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{merchant.completedJobsCount}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>平均評分</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{(merchant.averageRating || 0).toFixed(1)} ★</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {!merchant.isVerified ? (
                <button style={{ 
                  flex: 1, 
                  backgroundColor: '#6366f1', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <ShieldCheck size={18} /> 批准認證
                </button>
              ) : (
                <button style={{ 
                  flex: 1, 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  color: '#94a3b8', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'default'
                }}>
                  管理商戶資訊
                </button>
              )}
              <button style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                <ShieldAlert size={18} />
              </button>
            </div>
          </div>
        ))}

        {merchants.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
            目前尚無註冊商戶。
          </div>
        )}
      </div>
    </div>
  );
}
