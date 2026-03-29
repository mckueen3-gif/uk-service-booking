import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, History, CreditCard, ArrowUpRight, ArrowDownLeft, Landmark, Info, CheckCircle2, Clock, Calculator } from "lucide-react";
import { getEarningsStats } from "@/app/actions/finance";
import BankForm from "./BankForm";
import WithdrawForm from "./WithdrawForm";

export default async function MerchantWalletPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { wallet, recentBookings, recentWithdrawals, merchant, error } = await getEarningsStats() as any;

  if (error) return <div>Error loading wallet: {error}</div>;

  // Commission Logic Tiers
  const jobs = merchant.completedJobsCount || 0;
  let currentRate = 12;
  let nextGoal = 0;
  let nextRate = 0;

  if (jobs <= 3) {
    currentRate = 0;
    nextGoal = 4 - jobs;
    nextRate = 5;
  } else if (jobs <= 10) {
    currentRate = 5;
    nextGoal = 11 - jobs;
    nextRate = 12;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          營收管理與提現 <span style={{ color: 'var(--accent-color)' }}>Earnings</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>查看您的服務收入與管理提現申請。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Available Balance Card */}
        <div className="glass-panel animate-fade-up delay-100" style={{ 
          padding: '2.5rem', 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.15 }}>
            <Wallet size={160} />
          </div>
          <div style={{ marginBottom: '1.5rem', opacity: 0.9, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>AVAILABLE FOR WITHDRAWAL</div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, marginRight: '0.4rem' }}>£</span>
            <span style={{ fontSize: '4rem', fontWeight: 900 }}>{wallet?.availableBalance?.toFixed(2) || "0.00"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <CheckCircle2 size={16} /> 已結算且隨時可領取
          </div>
        </div>

        {/* Pending & Total Cards */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
          <div className="glass-panel animate-fade-up delay-200" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: 'var(--accent-soft)', padding: '1rem', borderRadius: '1rem' }}>
               <Clock size={28} color="var(--accent-color)" />
             </div>
             <div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PENDING ESCROW</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{wallet?.pendingBalance?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>進行中的服務代管中</div>
             </div>
          </div>
          <div className="glass-panel animate-fade-up delay-300" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
               <Calculator size={28} color="#0ea5e9" />
             </div>
             <div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>ALL-TIME EARNINGS</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{wallet?.totalEarned?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>累計總收入 (扣除佣金後)</div>
             </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Withdrawal & Bank */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel animate-fade-up delay-400" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Landmark size={24} color="var(--accent-color)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>提現與帳戶設置 Setup</h2>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <BankForm initialSortCode={merchant.bankSortCode} initialAccountNumber={merchant.bankAccountNumber} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>申請提現 (Withdraw)</h3>
              <WithdrawForm availableBalance={wallet?.availableBalance || 0} />
            </div>
          </div>

          {/* Commission Tier Progress */}
          <div className="glass-panel animate-fade-up delay-500" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <TrendingUp size={20} color="var(--accent-color)" />
                 <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>您的佣金等級 (Tier)</h2>
               </div>
               <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-color)', marginLeft: 'auto' }}>
                 核心抽成: {currentRate}%
               </span>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              目前已完成 <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{jobs}</span> 筆服務。
              {nextGoal > 0 ? (
                <span> 距離下個階段還差 <span style={{ fontWeight: 800, color: 'var(--accent-color)' }}>{nextGoal}</span> 筆服務。</span>
              ) : (
                <span> 您正在享受最優質的抽成待遇！</span>
              )}
            </p>
            
            <div style={{ height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '10px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min((jobs / 11) * 100, 100)}%`, 
                backgroundColor: 'var(--accent-color)', 
                borderRadius: '10px',
                transition: 'width 0.8s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              <span>0筆 (0%)</span>
              <span>4筆 (5%)</span>
              <span>11筆+ (12%)</span>
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="glass-panel animate-fade-up delay-600" style={{ padding: '2.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <History size={24} color="var(--accent-color)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>提現記錄 (Payout History)</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ paddingBottom: '1rem', fontWeight: 700 }}>日期 Date</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 700 }}>金額 Amount</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 700 }}>狀態 Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1rem' }}>尚無提現記錄</td>
                  </tr>
                ) : (
                  recentWithdrawals.map((req: any) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1.25rem 0', fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>£{req.amount.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 0' }}>
                        <span style={{ 
                          backgroundColor: req.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                          color: req.status === 'PENDING' ? '#f59e0b' : '#10b981', 
                          padding: '0.35rem 0.75rem', 
                          borderRadius: '8px', 
                          fontSize: '0.75rem', 
                          fontWeight: 800,
                          border: `1px solid ${req.status === 'PENDING' ? '#f59e0b' : '#10b981'}`
                        }}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
