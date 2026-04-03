"use client";

import { useEffect, useState } from "react";
import { getPayoutStats } from "@/lib/actions/admin";
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
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminPayouts() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

  useEffect(() => {
    async function load() {
      const data = await getPayoutStats();
      setStats(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
         <FinancialBox 
           label={t.admin.payouts.snapshot} 
           value={`£${stats?.totalAssets?.toLocaleString() || "142,500"}`} 
           sub="全平台資金流轉通量" 
           accent="#d4af37" 
           icon={<Wallet size={20} />}
         />
         <FinancialBox 
           label="待處理清算" 
           value={`£${stats?.pendingPayouts?.toLocaleString() || "8,420"}`} 
           sub={t.admin.payouts.pending} 
           accent="#0f172a" 
           icon={<Clock size={20} />}
         />
         <FinancialBox 
           label="今日清算總額" 
           value={`£${stats?.todayVolume?.toLocaleString() || "2,150"}`} 
           sub={t.admin.payouts.volume} 
           accent="#d4af37" 
           icon={<TrendingUp size={20} />}
         />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 0.8fr', 
        gap: '2rem' 
      }}>
        {/* Adjudication Table */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '1.5rem', 
          border: '1px solid #e2e8f0', 
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.admin.payouts.adjudication}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '10px', fontWeight: 800 }}>
              <ShieldCheck size={12} />
              {t.admin.payouts.security}
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>收款專家</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>清算金額</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{t.admin.payouts.method}</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Tech Repair Central</div>
                   <div style={{ fontSize: '10px', color: '#94a3b8' }}>ID: MERCHANT_NODE_01</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>£450.00</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                     <CreditCard size={14} />
                     Stripe Connect
                   </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <button style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#0f172a', color: '#d4af37', fontSize: '10px', fontWeight: 900, border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
                     准予支付
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Global Commission Overwrite */}
        <div style={{ 
          padding: '2.5rem', 
          backgroundColor: '#ffffff', 
          borderRadius: '1.5rem', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
           <div>
             <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', margin: 0 }}>{t.admin.commissions.title}</h3>
             <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{t.admin.commissions.sub}</p>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>{t.admin.commissions.marketplaceFee}</span>
                 <input type="text" defaultValue="9%" style={{ width: '60px', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12px', fontWeight: 800 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>{t.admin.commissions.plateformFee}</span>
                 <input type="text" defaultValue="0.5%" style={{ width: '60px', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12px', fontWeight: 800 }} />
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1.5rem', borderRadius: '1.25rem', border: '1px dashed #d4af37', backgroundColor: 'rgba(212,175,55,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <p style={{ fontSize: '11px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{t.admin.commissions.adminControl}</p>
                   <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>8.2%</span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                   <div style={{ width: '82%', height: '100%', backgroundColor: '#d4af37' }}></div>
                </div>
              </div>
           </div>

           <button style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: '12px', backgroundColor: '#0f172a', color: '#d4af37', border: 'none', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
             保存費率變更
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function FinancialBox({ label, value, sub, accent, icon }: any) {
  return (
    <div style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `${accent}15`, color: accent }}>
             {icon}
          </div>
          <div>
            <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{value}</p>
          </div>
       </div>
       <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: 0 }}>{sub}</p>
    </div>
  );
}
