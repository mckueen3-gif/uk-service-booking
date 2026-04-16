"use client";

import { useEffect, useState } from "react";
import { getPayoutStats } from "@/app/actions/admin_actions";
import { processWithdrawal } from "@/app/actions/admin";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Loader2,
  Zap,
  DollarSign,
  XCircle,
  MinusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminPayouts() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { t } = useTranslation();

  async function load() {
    setLoading(true);
    const data = await getPayoutStats();
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(id: string, status: "COMPLETED" | "REJECTED") {
    if (!confirm(`確定要將此申請標註為 ${status === 'COMPLETED' ? '已支付 (Stripe 將執行轉帳)' : '已拒絕 (資金將退回主錢包)'} 嗎？`)) return;
    
    setProcessingId(id);
    try {
      const result = await processWithdrawal(id, status);
      if (result.success) {
        alert(result.message);
        load(); // Refresh table
      } else {
        alert("失敗: " + result.message);
      }
    } catch (err: any) {
      alert("出錯了: " + err.message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      <div style={{ padding: '0 0.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.sidebar.payouts}</h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>平台資金流動與費率結算中心</p>
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
         <FinancialBox 
           label={t.admin.payouts.snapshot} 
           value={`£${stats?.totalAssets?.toLocaleString() || "0"}`} 
           sub="全平台資金流轉通量" 
           accent="#d4af37" 
           icon={<Wallet size={24} />}
           trend="+12.5%"
         />
         <FinancialBox 
           label="待處理清算" 
           value={`£${stats?.pendingPayouts?.toLocaleString() || "0"}`} 
           sub={t.admin.payouts.pending} 
           accent="#0f172a" 
           icon={<Clock size={24} />}
         />
         <FinancialBox 
           label="今日清算總額" 
           value={`£${stats?.todayVolume?.toLocaleString() || "0"}`} 
           sub={t.admin.payouts.volume} 
           accent="#c5a02e" 
           icon={<TrendingUp size={24} />}
           trend="+5.2%"
         />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)', 
        gap: '2.5rem' 
      }}>
        {/* Adjudication Table */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(184, 134, 11, 0.08)', 
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.04)'
        }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>{t.admin.payouts.adjudication}</h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              borderRadius: '99px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981', 
              fontSize: '11px', 
              fontWeight: 900,
              textTransform: 'uppercase'
            }}>
              <ShieldCheck size={14} />
              {t.admin.payouts.security}
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafbfc' }}>
                <th style={{ padding: '1.5rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9' }}>收款專家</th>
                <th style={{ padding: '1.5rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9' }}>清算金額</th>
                <th style={{ padding: '1.5rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.payouts.method}</th>
                <th style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9' }}></th>
              </tr>
            </thead>
            <tbody>
              {loading && !stats ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} color="#d4af37" /></td></tr>
                ))
              ) : stats?.pendingRequests?.length > 0 ? (
                stats.pendingRequests.map((req: any) => {
                  const grossAmount = req.amount;
                  const stripeFee = grossAmount * 0.0025 + 0.25;
                  const netPayout = grossAmount - stripeFee;
                  const isProcessing = processingId === req.id;

                  return (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '1.75rem 2rem' }}>
                         <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>{req.merchant.companyName}</div>
                         <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>ID: {req.merchant.id.substring(0, 10)}...</div>
                      </td>
                      <td style={{ padding: '1.75rem 2rem' }}>
                         <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>£{grossAmount.toFixed(2)}</div>
                         <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>Fee: -£{stripeFee.toFixed(2)}</div>
                         <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 800 }}>Net: £{netPayout.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '1.75rem 2rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#64748b' }}>
                           <CreditCard size={16} />
                           Stripe Connect
                         </div>
                      </td>
                      <td style={{ padding: '1.75rem 2rem' }}>
                         <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                           <button 
                             onClick={() => handleAction(req.id, 'REJECTED')}
                             disabled={!!processingId}
                             style={{ 
                                padding: '10px 16px', 
                                borderRadius: '12px', 
                                backgroundColor: '#fff', 
                                color: '#ef4444', 
                                fontSize: '11px', 
                                fontWeight: 900, 
                                border: '1px solid #fee2e2', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                             }}
                           >
                             <MinusCircle size={14} />
                             拒絕
                           </button>
                           <button 
                             onClick={() => handleAction(req.id, 'COMPLETED')}
                             disabled={!!processingId}
                             style={{ 
                                padding: '10px 20px', 
                                borderRadius: '12px', 
                                backgroundColor: '#0f172a', 
                                color: '#d4af37', 
                                fontSize: '11px', 
                                fontWeight: 900, 
                                border: 'none', 
                                cursor: 'pointer', 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 8px 20px rgba(15,23,42,0.1)'
                             }}
                           >
                             {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                             准予支付 £{netPayout.toFixed(2)}
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                    暫無待處理的清算申請
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Global Commission Overwrite */}
        <div style={{ 
          padding: '3rem', 
          backgroundColor: '#ffffff', 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(184, 134, 11, 0.08)', 
          boxShadow: '0 30px 70px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>
           <div>
             <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(212,175,55,0.08)', 
                color: '#d4af37', 
                marginBottom: '1.5rem'
             }}>
               <Zap size={18} />
               <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>費率配置中心</span>
             </div>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.commissions.title}</h3>
             <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>{t.admin.commissions.sub}</p>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DollarSign size={18} color="#d4af37" />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>{t.admin.commissions.marketplaceFee}</span>
                 </div>
                 <input type="text" defaultValue="9%" style={{ width: '70px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', fontWeight: 900, backgroundColor: '#fafbfc' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} color="#d4af37" />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>{t.admin.commissions.plateformFee}</span>
                 </div>
                 <input type="text" defaultValue="0.5%" style={{ width: '70px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', fontWeight: 900, backgroundColor: '#fafbfc' }} />
              </div>
              
              <div style={{ marginTop: '1rem', padding: '2rem', borderRadius: '2rem', border: '1px dashed rgba(184, 134, 11, 0.2)', backgroundColor: 'rgba(212,175,55,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                   <p style={{ fontSize: '11px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>目前加權總抽成率</p>
                   <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>8.2<span style={{ fontSize: '14px' }}>%</span></span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                   <div style={{ width: '82%', height: '100%', backgroundColor: '#0f172a', borderRadius: '99px' }}></div>
                </div>
              </div>
           </div>

           <button style={{ 
              marginTop: '1rem', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              backgroundColor: '#0f172a', 
              color: '#d4af37', 
              border: 'none', 
              fontWeight: 900, 
              fontSize: '13px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              cursor: 'pointer',
              boxShadow: '0 15px 30px rgba(15,23,42,0.15)',
              transition: 'all 0.2s'
           }}>
             保存費率變更
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function FinancialBox({ label, value, sub, accent, icon, trend }: any) {
  return (
    <div style={{ 
      padding: '2.5rem', 
      borderRadius: '2.5rem', 
      backgroundColor: '#ffffff', 
      border: '1px solid rgba(184, 134, 11, 0.08)', 
      boxShadow: '0 30px 70px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden'
    }}>
       <div style={{ 
          position: 'absolute', 
          right: '-20px', 
          top: '-20px', 
          width: '120px', 
          height: '120px', 
          background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
          borderRadius: '50%'
       }} />
       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            padding: '0.875rem', 
            borderRadius: '16px', 
            backgroundColor: `${accent}10`, 
            color: accent,
            boxShadow: `0 8px 20px ${accent}08`
          }}>
             {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{label}</h4>
                {trend && (
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowUpRight size={14} />
                        {trend}
                    </span>
                )}
            </div>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '8px 0 0 0', letterSpacing: '-0.03em' }}>{value}</p>
          </div>
       </div>
       <div style={{ height: '1px', width: '100%', backgroundColor: '#f1f5f9', marginBottom: '1.25rem' }} />
       <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} style={{ opacity: 0.5 }} />
          {sub}
       </p>
    </div>
  );
}
