"use client";

import { useEffect, useState } from "react";
import { getPayoutStats } from "@/app/actions/admin_actions";
import { processWithdrawal } from "@/app/actions/admin";
import { 
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  TrendingUp,
  Loader2,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem' }}
    >
      {/* Infrastructure Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '-1rem' }}>
        <div>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.3em', margin: 0, opacity: 0.8 }}>
            {t.admin.header.internal}
          </h2>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0' }}>
            {t.admin.payouts.title}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>{t.admin.header.node}</p>
           <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: 0 }}>FIN-X1-CLEARANCE</p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
         <FinancialBox 
           label={t.admin.payouts.snapshot} 
           value={`£${stats?.totalAssets?.toLocaleString() || "0"}`} 
           sub={t.admin.payouts.snapshotSub} 
           accent="#d4af37" 
           icon={<Wallet size={24} />}
           trend="+12.5%"
         />
         <FinancialBox 
           label={t.admin.payouts.pending} 
           value={`£${stats?.pendingPayouts?.toLocaleString() || "0"}`} 
           sub={t.admin.payouts.pendingSub} 
           accent="#0f172a" 
           icon={<Clock size={24} />}
         />
         <FinancialBox 
           label={t.admin.payouts.volume} 
           value={`£${stats?.todayVolume?.toLocaleString() || "0"}`} 
           sub={t.admin.payouts.volumeSub} 
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
          border: '1px solid #e2e8f0', 
          overflow: 'hidden',
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.05), 0 18px 36px -18px rgba(0,0,0,0.05)',
          position: 'relative'
        }}>
          {/* Decorative Grid Overlay */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', 
            backgroundSize: '30px 30px', 
            opacity: 0.2, 
            pointerEvents: 'none' 
          }} />

          <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Activity className="animate-pulse" style={{ color: '#c5a02e' }} />
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t.admin.payouts.adjudication}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', fontSize: '10px', fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '99px', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              {t.admin.payouts.security}
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafbfc' }}>
                <th style={{ padding: '1.5rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.payouts.merchant}</th>
                <th style={{ padding: '1.5rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.payouts.amount}</th>
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
                         <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>{t.admin.payouts.fee}: -£{stripeFee.toFixed(2)}</div>
                         <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 800 }}>{t.admin.payouts.net}: £{netPayout.toFixed(2)}</div>
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
                             {t.admin.payouts.reject}
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
                             {t.admin.payouts.approve} £{netPayout.toFixed(2)}
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                    {t.admin.payouts.emptyState}
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
          border: '1px solid #e2e8f0', 
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', 
            backgroundSize: '20px 20px', 
            opacity: 0.1, 
            pointerEvents: 'none' 
          }} />

           <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)', 
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#d4af37', 
                marginBottom: '1.5rem'
             }}>
               <Zap size={18} className="animate-pulse" />
               <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.commissions.config}</span>
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
                 <input type="text" defaultValue="10%" style={{ width: '70px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', fontWeight: 900, backgroundColor: '#fafbfc' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} color="#d4af37" />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>{t.admin.commissions.platformFee}</span>
                  </div>
                  <input type="text" defaultValue="0.5%" style={{ width: '70px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '14px', fontWeight: 900, backgroundColor: '#fafbfc' }} />
              </div>
              
              <div style={{ marginTop: '1rem', padding: '2rem', borderRadius: '2rem', border: '1px dashed rgba(184, 134, 11, 0.2)', backgroundColor: 'rgba(212,175,55,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                   <p style={{ fontSize: '11px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.admin.commissions.weightedAvg}</p>
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
             {t.admin.commissions.save}
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function FinancialBox({ label, value, sub, accent, icon, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ 
        padding: '2.5rem', 
        borderRadius: '2.5rem', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
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
    </motion.div>
  );
}
