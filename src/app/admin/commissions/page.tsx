import { prisma } from "@/lib/prisma";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Percent
} from "lucide-react";
import { getCommissionRate } from "@/lib/commission";
import CommissionEditor from "./CommissionEditor";

export default async function AdminCommissionsPage() {
  const merchants = await prisma.merchant.findMany({
    orderBy: { completedJobsCount: 'desc' }
  });

  const totalCompletedJobs = merchants.reduce((sum, m) => sum + m.completedJobsCount, 0);
  
  // Calculate average commission rate across all merchants
  const avgCommission = merchants.length > 0 
    ? (merchants.reduce((sum, m) => sum + getCommissionRate(m), 0) / merchants.length)
    : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>佣金管理系統</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>監控各商戶的佣金比例與平台收益表現。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1.5rem', padding: '1.75rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8', marginBottom: '1rem', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Percent size={18} /> 平均佣金率
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>{(avgCommission * 100).toFixed(1)}%</div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.75rem' }}>全平台商戶加權平均比例</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1.5rem', padding: '1.75rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#34d399', marginBottom: '1rem', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <TrendingUp size={18} /> 總結算訂單
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>{totalCompletedJobs}</div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.75rem' }}>平台已完成交付服務量</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '2rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PieChart size={24} className="text-indigo-400" />
          商戶佣金詳情
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {merchants.map((merchant) => {
            const rate = getCommissionRate(merchant);
            return (
              <div key={merchant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: '#334155', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem', border: '2px solid rgba(255,255,255,0.1)' }}>
                    {merchant.companyName[0]}
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{merchant.companyName}</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                       <span style={{ color: '#64748b', fontSize: '0.85rem' }}>完成訂單: <span style={{ color: '#94a3b8' }}>{merchant.completedJobsCount}</span></span>
                       <span style={{ color: '#64748b', fontSize: '0.85rem' }}>當前率: <span style={{ color: rate > 0 ? '#34d399' : '#818cf8', fontWeight: 700 }}>{(rate * 100).toFixed(0)}%</span></span>
                       {/* Free orders display disabled for schema sync */}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <CommissionEditor 
                    merchantId={merchant.id} 
                    initialRate={merchant.commissionRate}
                    initialFreeOrders={0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {merchants.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: '#94a3b8' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
            <p>尚無商戶數據，請先註冊商戶後查看。</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.75rem', color: '#818cf8' }}>
          <Percent size={20} />
        </div>
        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.25rem' }}>佣金管理說明</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            默認佣金為 9%。修改比例後，將立即影響該商戶下一次生成的 Stripe 結帳頁面。
            [免佣配額管理暫時停用，以配合伺服器維護]
          </p>
        </div>
      </div>
    </div>
  );
}
