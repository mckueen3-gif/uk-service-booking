import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Gavel, AlertCircle, CheckCircle2, Clock, Scale, Info, MessageSquare, Camera, Sparkles, User, Hammer, FileText, ChevronDown, Bot, Terminal, Cpu } from "lucide-react";
import { getDisputeDetails } from "@/app/actions/dispute";
import ArbiterAction from "./ArbiterAction";
import Link from "next/link";

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = (await getServerSession(authOptions)) as any;
  if (!session) redirect("/auth/login");

  const { dispute } = await getDisputeDetails(resolvedParams.id) as any;
  if (!dispute) notFound();

  const isCustomer = session.user.id === dispute.booking.customerId;
  const oppositeParty = isCustomer ? dispute.booking.merchant.companyName : dispute.booking.customer.name;
  const variation = dispute.booking.variations?.find((v: any) => v.status === 'PENDING' || v.status === 'APPROVED' || v.status === 'REJECTED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
           <Link href="/dashboard/disputes" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="hover-scale">
             ← <span style={{ textDecoration: 'underline' }}>返回爭議列表</span>
           </Link>
           <span style={{ color: 'var(--border-color)' }}>/</span>
           <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-color)', letterSpacing: '0.05em' }}>CASE #{dispute.id.slice(-6).toUpperCase()}</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>
          AI 爭議調解法庭 <span className="gradient-text">Arbiter Room</span>
        </h1>
        <p className="hero-subtitle" style={{ margin: 0 }}>正在審理與 <strong>{oppositeParty}</strong> 的服務金額異議方案。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem' }} className="responsive-dispute-grid">
        
        {/* Main Case Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Dispute Context Card */}
          <div className="glass-panel animate-fade-up delay-100" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                  <FileText size={24} color="var(--accent-color)" /> 爭議核心事由
                </h2>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>立案時間</div>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{new Date(dispute.createdAt).toLocaleString()}</div>
                </div>
             </div>
             
             <div style={{ 
               background: 'var(--surface-2)', 
               padding: '1.5rem 2rem', 
               borderRadius: '1.25rem', 
               border: '1px solid var(--border-color)',
               position: 'relative'
             }}>
               <div style={{ position: 'absolute', left: '0', top: '1.5rem', bottom: '1.5rem', width: '4px', backgroundColor: 'var(--accent-color)', borderRadius: '0 4px 4px 0' }}></div>
               <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.7, fontWeight: 500 }}>
                 &ldquo;{dispute.reason}&rdquo;
               </p>
             </div>
             
             <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <User size={18} /> <span style={{ fontWeight: 600 }}>發起方:</span> {dispute.openedById === dispute.booking.customerId ? '客戶 (Alice)' : '商戶 (London Fix)'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Scale size={18} /> <span style={{ fontWeight: 600 }}>管轄規則:</span> UK ADR Policy V2
                </div>
             </div>
          </div>

          {/* AI Arbiter Panel - THE HIGHLIGHT */}
          <div className="animate-fade-up delay-200" style={{ perspective: '1000px' }}>
            <div className="glass-panel" style={{ 
              padding: '0', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              border: '1px solid var(--accent-color)',
              boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.25)',
              background: 'var(--bg-primary)'
            }}>
               <div style={{ 
                 background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', 
                 padding: '1.25rem 2rem', 
                 color: 'white',
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center'
               }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                      <Bot size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, letterSpacing: '0.5px' }}>Gemini 1.5 Arbiter Pro</h3>
                      <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Autonomous Legal Reasoning Core</div>
                    </div>
                  </div>
                  <ArbiterAction disputeId={dispute.id} status={dispute.status} />
               </div>

               <div style={{ padding: '2rem' }}>
                 {dispute.aiDecision ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          backgroundColor: dispute.aiDecision === 'FORCE_PAYOUT' ? 'rgba(16, 185, 129, 0.15)' : dispute.aiDecision === 'REFUND_CUSTOMER' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: dispute.aiDecision === 'FORCE_PAYOUT' ? '#10b981' : dispute.aiDecision === 'REFUND_CUSTOMER' ? '#ef4444' : '#f59e0b',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '12px',
                          fontWeight: 900,
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          border: '1px solid currentColor'
                        }}>
                          {dispute.aiDecision === 'FORCE_PAYOUT' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                          {dispute.aiDecision}
                        </div>
                        <div style={{ height: '2px', flex: 1, backgroundColor: 'var(--surface-3)' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>FINAL VERDICT</span>
                      </div>

                      {/* AI Terminal Style Reasoning */}
                      <div style={{ 
                        backgroundColor: '#0f172a', 
                        color: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                        border: '1px solid #334155'
                      }}>
                         <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                            <Terminal size={16} color="#60a5fa" />
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ANALYSIS_LOG_STDOUT</span>
                         </div>
                         <div style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>&gt; Initializing reasoning engine... Done.</div>
                         <div style={{ color: '#10b981', marginBottom: '1rem' }}>&gt; Final Conclusion:</div>
                         <p style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                            {dispute.aiReasoning}
                         </p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                         <Info size={16} /> 此裁決基於上傳之實地相片證據與 UK 市場維修行情大數據自動生成。
                      </div>
                   </div>
                 ) : (
                   <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                      <div className="animate-float">
                        <Cpu size={64} style={{ opacity: 0.15, marginBottom: '1.5rem', color: 'var(--accent-color)' }} />
                      </div>
                      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 800 }}>案件等待仲裁中</h3>
                      <p style={{ maxWidth: '400px', margin: '0 auto' }}>請確認所有相關證據（包括施工現場照片與文字描述）已上傳完畢。準備好後，點擊上方按鈕執行 AI 評估。</p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Evidence Gallery */}
          <div className="glass-panel animate-fade-up delay-300" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
             <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
               <Camera size={24} color="var(--accent-color)" /> 核心證據卷宗 (Evidence Portfolio)
             </h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {variation?.photoUrl && (
                  <div className="hover-scale" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--surface-1)' }}>
                    <img src={variation.photoUrl} alt="Variation Proof" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                    <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-2)' }}>
                       <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-color)', marginBottom: '0.25rem' }}>商戶上傳</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>施工現場加價證明照片</div>
                    </div>
                  </div>
                )}
                {dispute.evidence.map((ev: any) => (
                  <div key={ev.id} className="hover-scale" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--surface-1)' }}>
                    {ev.type === 'IMAGE' ? (
                      <img src={ev.fileUrl} alt="Evidence" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface-3)' }}>
                         <MessageSquare size={48} color="var(--text-muted)" />
                      </div>
                    )}
                    <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-2)' }}>
                       <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>案件證據</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ev.description || '爭議相關佐證資料'}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Case Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel animate-fade-up delay-400" style={{ padding: '1.75rem', borderRadius: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>相關服務資訊</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-soft)', padding: '0.75rem', borderRadius: '1rem', color: 'var(--accent-color)' }}>
                    <Hammer size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{dispute.booking.service.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dispute.booking.merchant.companyName}</div>
                  </div>
               </div>
               
               <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>爭議金額</span>
                    <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1.1rem' }}>£{variation?.amount || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>原始預約金額</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>£{dispute.booking.totalAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>當前預約狀態</span>
                    <span style={{ 
                      fontWeight: 800, 
                      fontSize: '0.8rem', 
                      backgroundColor: 'var(--surface-2)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>{dispute.booking.status}</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="glass-panel animate-fade-up delay-500" style={{ padding: '1.75rem', borderRadius: '1.5rem', background: 'var(--glass-bg)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>調解進度 Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
               <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--border-color)' }} />
               
               <TimelineItem 
                 active={true} 
                 title="案件已立案" 
                 date={new Date(dispute.createdAt).toLocaleString()} 
               />
               <TimelineItem 
                 active={dispute.evidence.length > 0 || variation?.photoUrl} 
                 title="證據搜集與分析" 
                 subtitle={`目前共有 ${dispute.evidence.length + (variation?.photoUrl ? 1 : 0)} 份各類證據`} 
               />
               <TimelineItem 
                 active={!!dispute.aiDecision} 
                 title="AI 自動仲裁裁決" 
                 subtitle={dispute.aiDecision ? '仲裁流程已完成' : '等待執行指令'} 
               />
               <TimelineItem 
                 active={dispute.status === 'RESOLVED'} 
                 title="資金執行與結案" 
               />
            </div>
          </div>

          {/* Support Widget */}
          <div className="glass-panel animate-fade-up delay-600" style={{ padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'center' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>對 AI 裁決有任何疑問？</p>
             <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>聯絡律師介入調查</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ active, title, date, subtitle }: { active: boolean, title: string, date?: string, subtitle?: string }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
      <div style={{ 
        width: '18px', 
        height: '18px', 
        borderRadius: '50%', 
        backgroundColor: active ? 'var(--accent-color)' : 'var(--surface-3)', 
        border: '4px solid var(--bg-primary)',
        boxShadow: active ? '0 0 10px var(--accent-color)' : 'none'
      }} />
      <div style={{ opacity: active ? 1 : 0.5 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</div>
        {date && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{date}</div>}
        {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
