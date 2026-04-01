import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, History, Landmark, Info, CheckCircle2, Clock, Calculator } from "lucide-react";
import { getEarningsStats } from "@/app/actions/finance";
import BankForm from "./BankForm";
import WithdrawForm from "./WithdrawForm";

export default async function MerchantWalletPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { wallet, recentWithdrawals, merchant, error } = await getEarningsStats() as any;

  if (error || !merchant) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', color: '#991b1b' }}>
          營收頁面加載失敗 <span style={{ color: 'var(--accent-color)' }}>Earnings</span>
        </h1>
        <p style={{ color: '#b91c1c' }}>{error || "商家資料初始化中或無法獲取。請確定您已完成專家註冊。"}</p>
      </div>
    );
  }

  // Standard Commission Rate
  const currentRate = 9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          資產與營收管理 <span style={{ color: 'var(--accent-color)' }}>Finance</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>查看您的可用資金、待結算款項以及預授權鎖定收入。</p>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                 可提現餘額 (已扣 9% 佣金)
              </div>
            </div>
    
            {/* Pending & Authorized Cards */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
              {/* Pending Card (Cooling-off / Education) */}
              <div className="glass-panel animate-fade-up delay-200" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                 <div style={{ backgroundColor: 'var(--accent-soft)', padding: '1rem', borderRadius: '1rem' }}>
                   <Clock size={28} color="var(--accent-color)" />
                 </div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PENDING / COOLING-OFF</div>
                   <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{wallet?.pendingBalance?.toFixed(2) || "0.00"}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>待結算餘額 (已扣 9% 佣金)</div>
                 </div>
              </div>
              {/* Authorized Card (Holds for Repairs) */}
              <div className="glass-panel animate-fade-up delay-300" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                 <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
                   <Landmark size={28} color="#0ea5e9" />
                 </div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>AUTHORIZED / HELD</div>
                   <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{wallet?.authorizedBalance?.toFixed(2) || "0.00"}</div>
                   <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>預授權鎖定中 (已扣 9% 佣金)</div>
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

          {/* Fee & Payment Terms Transparency */}
          <div className="glass-panel animate-fade-up delay-500" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <TrendingUp size={22} color="var(--accent-color)" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>收錢與收費條款</h2>
                </div>
                <div style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800 }}>
                  佣金: {currentRate}%
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--surface-1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                    <Info size={16} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>商戶權益說明</span>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0 }}>
                    <li>平台從每單人工及零件總額中扣除 <b>9% 佣金</b>。</li>
                    <li>平台的 9% 佣金已包含 **2% 的「客戶推薦人獎勵基金」**。</li>
                    <li><b>維修保障</b>：預約前 7 天自動鎖定尾款。若扣款失敗導致取消，訂金將作補償。</li>
                    <li><b>教育保障</b>：全款預扣，確保長期學費安全。</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: 'var(--surface-1)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    <History size={16} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>客戶支付條款</span>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0 }}>
                    <li><b>教育類</b>：享 14 天法定冷靜期。若開始上課即視為放棄餘下冷靜期。</li>
                    <li><b>維修類</b>：20% 訂金不予退還。餘額需在服務前 7 天完成鎖定。</li>
                  </ul>
                </div>
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
