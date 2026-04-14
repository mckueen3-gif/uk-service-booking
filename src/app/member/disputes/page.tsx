import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Gavel, AlertCircle, CheckCircle2, Clock, ChevronRight, Scale, Info, MessageSquare } from "lucide-react";
import { getDisputes } from "@/app/actions/dispute";
import Link from "next/link";

export default async function DisputesPage() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session) return null;

  const { disputes, error } = await getDisputes() as any;

  if (error) return <div>Error loading disputes: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="hero-title" style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          爭議仲裁中心 <span className="gradient-text">Dispute Center</span>
        </h1>
        <p className="hero-subtitle" style={{ margin: 0 }}>管理服務爭議。所有裁決均由 AI 輔助與專業團隊監督，確保公平、公正、公開。</p>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {disputes.length === 0 ? (
          <div className="glass-panel animate-fade-up" style={{ padding: '6rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
             <Scale size={64} style={{ marginBottom: '1.5rem', opacity: 0.2, color: 'var(--accent-color)' }} />
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>目前平安無事</h2>
             <p style={{ color: 'var(--text-secondary)' }}>您目前沒有任何開放中的爭議案件。良好的溝通是優質服務的基石。</p>
          </div>
        ) : (
          disputes.map((dispute: any, index: number) => (
            <Link 
              key={dispute.id} 
              href={`/dashboard/disputes/${dispute.id}`}
              className={`animate-fade-up delay-${(index % 6) * 100} hover-scale`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div 
                className="glass-panel"
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ 
                    backgroundColor: dispute.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.1)' : dispute.status === 'OPEN' ? 'rgba(245, 158, 11, 0.1)' : 'var(--accent-soft)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    color: dispute.status === 'RESOLVED' ? '#facc15' : dispute.status === 'OPEN' ? '#f59e0b' : 'var(--accent-color)'
                  }}>
                    {dispute.status === 'RESOLVED' ? <CheckCircle2 size={28} /> : dispute.status === 'OPEN' ? <AlertCircle size={28} /> : <Clock size={28} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CASE #{dispute.id.slice(-6)}</span>
                       <span style={{ 
                         fontSize: '0.7rem', 
                         fontWeight: 800, 
                         backgroundColor: dispute.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                         color: dispute.status === 'RESOLVED' ? '#facc15' : '#b45309',
                         padding: '0.2rem 0.6rem',
                         borderRadius: '6px',
                         textTransform: 'uppercase'
                       }}>
                         {dispute.status}
                       </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dispute.booking.service.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                       {session.user.role === 'CUSTOMER' ? `商戶: ${dispute.booking.merchant.companyName}` : `客戶: ${dispute.booking.customer.name}`}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right', display: 'none' /* Hidden on small screens */ } as any}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>立案日期</div>
                     <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{new Date(dispute.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ 
                    backgroundColor: 'var(--surface-2)', 
                    color: 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ADR Policy Tip */}
      <div className="glass-panel animate-fade-up delay-400" style={{ 
        padding: '2rem', 
        display: 'flex', 
        gap: '1.5rem',
        background: 'linear-gradient(to right, var(--accent-soft), transparent)',
        borderLeft: '4px solid var(--accent-color)'
      }}>
         <div style={{ color: 'var(--accent-color)' }}><Gavel size={32} /></div>
         <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>關於仲裁機制 (ADR Policy)</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
               我們的爭議處理系統採用 AI 輔助與人工審核並行。大部分涉及施工照片的額外收費（Variations）爭議可在 2 小時內透過 AI 仲裁自動解決。對於複雜且高標的案件，將自動轉由高級仲裁團隊人工复核，確保平台生態的健康與信任。
            </p>
         </div>
      </div>
    </div>
  );
}
