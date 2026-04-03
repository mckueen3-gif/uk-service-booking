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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '1.5rem', 
        border: '1px solid #e2e8f0', 
        marginBottom: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Percent style={{ color: '#d4af37' }} />
            Platform Commission Control
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Monitor merchant commission rates and platform yield performance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6366f1', marginBottom: '12px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <Percent size={18} /> Avg Commission Rate
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{(avgCommission * 100).toFixed(1)}%</div>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', margin: 0 }}>Platform-wide weighted average</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37', marginBottom: '12px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <TrendingUp size={18} /> Total Settled Jobs
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>{totalCompletedJobs}</div>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px', margin: 0 }}>Successful service delivery volume</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '2rem', padding: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <PieChart size={20} style={{ color: '#6366f1' }} />
          Merchant Commission Details
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {merchants.map((merchant) => {
            const rate = getCommissionRate(merchant);
            return (
              <div key={merchant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#ffffff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 800, fontSize: '1.25rem', border: '1px solid #e2e8f0' }}>
                    {merchant.companyName[0]}
                  </div>
                  <div>
                    <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{merchant.companyName}</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                       <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Orders: <span style={{ color: '#0f172a' }}>{merchant.completedJobsCount}</span></span>
                       <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Current Rate: <span style={{ color: '#d4af37' }}>{(rate * 100).toFixed(0)}%</span></span>
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

      <div style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: '1.25rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ padding: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.75rem', color: '#6366f1' }}>
          <Percent size={20} />
        </div>
        <div>
          <h4 style={{ color: '#0f172a', fontWeight: 800, fontSize: '14px', margin: 0 }}>Commission Management Rules</h4>
          <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: '2px', margin: 0 }}>
            Standard commission is locked at 8-9%. Changes take effect on the next Stripe checkout generation.
          </p>
        </div>
      </div>
    </div>
  );
}
