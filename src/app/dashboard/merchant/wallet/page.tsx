import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, History, Landmark, Info, CheckCircle2, Clock, Sparkles } from "lucide-react";
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', backgroundColor: '#050505', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>
          Assets & <span style={{ color: '#d4af37' }}>Premium Revenue</span>
        </h1>
        <p style={{ color: '#999', fontSize: '1.1rem' }}>Manage your high-tier earnings, pending settlements, and elite payout history.</p>
      </div>

      {/* Expert Referral Hub - New Feature Injection */}
      <div className="animate-fade-up delay-75" style={{ 
        padding: '1.5rem 2rem', 
        borderRadius: '24px', 
        background: 'rgba(212, 175, 55, 0.05)', 
        border: '1px dashed rgba(212, 175, 55, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '-1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#111', padding: '0.75rem', borderRadius: '12px', border: '1px solid #d4af37' }}>
            <Sparkles size={20} color="#d4af37" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: 0 }}>Expert Referral Rewards</h3>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Invite experts and earn 2% lifetime commission on their service fees.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#000', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '12px', 
            border: '1px solid #222',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: 900,
            color: '#d4af37',
            letterSpacing: '2px'
          }}>
            {(session?.user as any)?.referralCode || "GETTING-CODE..."}
          </div>
          <button 
            onClick={() => {
              const code = (session?.user as any)?.referralCode;
              if (code) navigator.clipboard.writeText(code);
              alert("Elite Referral Code Copied!");
            }}
            style={{ 
              backgroundColor: '#d4af37', 
              color: '#000', 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '12px', 
              fontWeight: 900, 
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            COPY LINK
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Available Balance Card - Black Gold Texture */}
        <div className="animate-fade-up delay-100" style={{ 
          padding: '2.5rem', 
          borderRadius: '32px', 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #d4af37',
          boxShadow: '0 10px 40px rgba(212, 175, 55, 0.15)'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, color: '#d4af37' }}>
            <Wallet size={180} />
          </div>
          <div style={{ marginBottom: '1.5rem', opacity: 0.6, fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', color: '#d4af37' }}>AVAILABLE FOR WITHDRAWAL</div>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, marginRight: '0.4rem', color: '#d4af37' }}>£</span>
            <span style={{ fontSize: '4.5rem', fontWeight: 900 }}>{wallet?.availableBalance?.toFixed(2) || "0.00"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#d4af37' }}>
            <CheckCircle2 size={16} /> Verified Net Earnings (Post 9% Premium Fee)
          </div>
        </div>
    
        {/* Pending & Authorized Cards - Obsidian Glass */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
          {/* Pending Card */}
          <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', border: '1px solid #d4af37' }}>
               <Clock size={28} color="#d4af37" />
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '0.75rem', color: '#555', fontWeight: 800, letterSpacing: '0.05em' }}>PENDING / COOLING-OFF</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>£{wallet?.pendingBalance?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>Settling Assets</div>
             </div>
          </div>
          {/* Authorized Card */}
          <div style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: '#0c0c0c', border: '1px solid #222', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '1rem', border: '1px solid #333' }}>
               <Landmark size={28} color="#d4af37" />
             </div>
             <div style={{ flex: 1 }}>
               <div style={{ fontSize: '0.75rem', color: '#555', fontWeight: 800, letterSpacing: '0.05em' }}>AUTHORIZED / HELD</div>
               <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>£{wallet?.authorizedBalance?.toFixed(2) || "0.00"}</div>
               <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>Escrowed for Repairs</div>
             </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Withdrawal & Bank */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '2rem', borderRadius: '28px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Landmark size={24} color="#d4af37" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>Banking & Settlements</h2>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <BankForm initialSortCode={merchant.bankSortCode} initialAccountNumber={merchant.bankAccountNumber} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '2rem 0' }} />

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '1.25rem' }}>Request Expert Payout</h3>
              <WithdrawForm availableBalance={wallet?.availableBalance || 0} />
            </div>
          </div>

          {/* Fee & Payment Terms Transparency - Premium Branding */}
          <div style={{ padding: '2rem', borderRadius: '28px', backgroundColor: '#0c0c0c', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <TrendingUp size={22} color="#d4af37" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>Yield & Premium Terms</h2>
                </div>
                <div style={{ padding: '0.5rem 1rem', backgroundColor: '#d4af37', color: '#000', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900 }}>
                  FEE: {currentRate}%
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: '#050505', padding: '1.5rem', borderRadius: '20px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', color: '#d4af37' }}>
                    <Info size={16} />
                    <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Rights & Premium Fee</span>
                  </div>
                  <ul style={{ fontSize: '0.85rem', color: '#999', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6 }}>
                    <li><b style={{ color: '#fff' }}>9% Premium Fee</b> applies to total labor and parts.</li>
                    <li>This includes a <b style={{ color: '#d4af37' }}>2% Referral Reward Fund</b> contribution.</li>
                    <li><b style={{ color: '#fff' }}>Liability Coverage</b>: Automated 7-day pre-settlement lock for all jobs.</li>
                    <li><b style={{ color: '#fff' }}>Referral Credits</b>: Earned bonuses from your personal network are paid out 1:1.</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#050505', padding: '1.25rem', borderRadius: '16px', border: '1px solid #1a1a1a', opacity: 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#666' }}>
                    <History size={16} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Standard Customer Terms</span>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#555', paddingLeft: '1.2rem', margin: 0 }}>
                    <li>14-day cooling-off period for academic services.</li>
                    <li>20% non-refundable deposit for repair/technical work.</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* Right: History - Obsidian Table */}
        <div style={{ padding: '2.5rem', borderRadius: '32px', backgroundColor: '#0c0c0c', border: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <History size={24} color="#d4af37" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>Expert Payout History</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>Transfer Date</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>Net Amount</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 800 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '4rem', textAlign: 'center', color: '#444', fontSize: '1rem', fontWeight: 600 }}>No payout history detected yet.</td>
                  </tr>
                ) : (
                  recentWithdrawals.map((req: any) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', color: '#999' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1.5rem 0', fontWeight: 900, color: '#fff', fontSize: '1.25rem' }}>£{req.amount.toFixed(2)}</td>
                      <td style={{ padding: '1.5rem 0' }}>
                        <span style={{ 
                          backgroundColor: req.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
                          color: req.status === 'PENDING' ? '#f59e0b' : '#d4af37', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '10px', 
                          fontSize: '0.75rem', 
                          fontWeight: 900,
                          border: `1px solid ${req.status === 'PENDING' ? '#f59e0b' : '#d4af37'}`
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
