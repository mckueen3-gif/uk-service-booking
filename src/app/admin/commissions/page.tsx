import { prisma } from "@/lib/prisma";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Percent
} from "lucide-react";
import { getCommissionRate } from "@/lib/commission";

export default async function AdminCommissionsPage() {
  const merchants = await prisma.merchant.findMany({
    orderBy: { completedJobsCount: 'desc' }
  });

  const totalCompletedJobs = merchants.reduce((sum, m) => sum + m.completedJobsCount, 0);
  
  // Calculate average commission rate across all merchants
  const avgCommission = merchants.length > 0 
    ? (merchants.reduce((sum, m) => sum + getCommissionRate(m.completedJobsCount), 0) / merchants.length)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>佣金統計 (Commission Statistics)</h1>
        <p style={{ color: '#94a3b8' }}>監控各商戶的佣金比例與平台收益表現。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8', marginBottom: '1rem', fontWeight: 700 }}>
            <Percent size={20} /> 平均佣金率
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{(avgCommission * 100).toFixed(1)}%</div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>全平台商戶加權平均</p>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#34d399', marginBottom: '1rem', fontWeight: 700 }}>
            <TrendingUp size={20} /> 總結算訂單
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{totalCompletedJobs}</div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>已成功交付的服務總量</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1.5rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>商戶階梯佣金詳情</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {merchants.map((merchant) => {
            const rate = getCommissionRate(merchant.completedJobsCount);
            return (
              <div key={merchant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                    {merchant.companyName[0]}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontWeight: 600 }}>{merchant.companyName}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>完成訂單: {merchant.completedJobsCount}</p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: rate > 0.1 ? '#f87171' : '#34d399' }}>
                      {(rate * 100).toFixed(0)}%
                    </span>
                    <ArrowUpRight size={18} color="#94a3b8" />
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.75rem' }}>當前佣金比例</p>
                </div>
              </div>
            );
          })}
        </div>

        {merchants.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            尚無商戶數據。
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.85rem' }}>
        <strong>佣金規則提醒：</strong> 0-5 案 (0%)，6-55 案 (8%)，之後每增加 50 案佣金增加 1%，上限 12%。
      </div>
    </div>
  );
}
