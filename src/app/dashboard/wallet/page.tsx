import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, Gift, Copy, History, CreditCard, Ticket, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { getWalletStats, ensureReferralCode } from "@/app/actions/wallet";
import VoucherForm from "./VoucherForm";

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const { stats, error } = await getWalletStats() as any;
    const referralCode = await ensureReferralCode();

    if (error || !stats) {
      return (
        <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '1rem' }}>抱歉，載入錢包數據時出錯</h2>
          <p style={{ color: '#b91c1c' }}>{error || "找不到您的錢包資訊。請稍後再試或聯繫客服。"}</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Wallet Header */}
        <div className="animate-fade-up">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            電子錢包與獎勵 <span style={{ color: 'var(--accent-color)' }}>Wallet</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>管理您的獎勵點數與優惠券。</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Main Balance Card */}
          <div className="glass-panel animate-fade-up delay-100" style={{ 
            padding: '2.5rem', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
              <Wallet size={160} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', opacity: 0.8 }}>
              <CreditCard size={20} />
              <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>AVAILABLE CREDITS</span>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, verticalAlign: 'top', marginRight: '0.5rem' }}>£</span>
              <span style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{stats?.referralCredits?.toFixed(2) || "0.00"}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>
                  <TrendingUp size={16} /> +12% vs last month
               </div>
               <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>可用於折抵下一次服務</div>
            </div>
          </div>

          {/* Voucher Redemption & Referral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Voucher Section */}
            <div className="glass-panel animate-fade-up delay-200" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#fdf2f2', padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <Ticket size={24} color="#ef4444" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>兌換優惠碼</h2>
              </div>
              <VoucherForm />
            </div>

            {/* Referral Section */}
            <div className="glass-panel animate-fade-up delay-300" style={{ padding: '2rem', borderRadius: '24px', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#eef2ff', padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <Gift size={24} color="#6366f1" />
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b' }}>推薦好友，享 2% 被動收入</h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#4338ca', marginBottom: '1.5rem' }}>
                分享您的代碼，好友註冊後每完成一筆訂單，您都將獲得 <span style={{ fontWeight: 800 }}>2% 服務金回饋</span>！<br />
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(每位好友上限 £200 或註冊滿 5 年為止)</span>
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: 'white', 
                padding: '0.75rem 1rem', 
                borderRadius: '1rem',
                border: '1px dashed #6366f1'
              }}>
                <span style={{ fontWeight: 900, color: '#6366f1', fontSize: '1.2rem', letterSpacing: '0.1em' }}>{referralCode}</span>
                <button style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }} title="Copy Code">
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="glass-panel animate-fade-up delay-400" style={{ padding: '2.5rem', borderRadius: '24px', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <History size={24} color="var(--accent-color)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>點數明細 (Transaction History)</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.9rem' }}>
                  <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>類型 (Type)</th>
                  <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>說明 (Activity)</th>
                  <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>金額 (Amount)</th>
                  <th style={{ paddingBottom: '1.25rem', fontWeight: 600 }}>日期 (Date)</th>
                </tr>
              </thead>
              <tbody>
                {stats.creditTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>目前尚無交易紀錄</td>
                  </tr>
                ) : (
                  stats.creditTransactions.map((tx: any) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '1.5rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {tx.amount > 0 ? (
                            <div style={{ backgroundColor: '#ecfdf5', padding: '0.4rem', borderRadius: '50%' }}><ArrowDownLeft size={16} color="#10b981" /></div>
                          ) : (
                            <div style={{ backgroundColor: '#fff1f2', padding: '0.4rem', borderRadius: '50%' }}><ArrowUpRight size={16} color="#ef4444" /></div>
                          )}
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tx.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>{tx.description}</td>
                      <td style={{ padding: '1.5rem 0' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: tx.amount > 0 ? '#10b981' : '#ef4444' }}>
                          {tx.amount > 0 ? '+' : ''}£{Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (criticalError) {
    console.error("Wallet Page CRITICAL CRASH:", criticalError);
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
        <h2 style={{ color: '#991b1b', marginBottom: '1rem' }}>抱歉，錢包服務暫時不可用 (Critical Error)</h2>
        <p style={{ color: '#b91c1c' }}>系統遇到致命錯誤，請稍後再試。錯誤代碼: WL-CRIT-500</p>
      </div>
    );
  }
}
