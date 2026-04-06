"use client";

import { useEffect, useState } from "react";
import { getAdminMerchants, toggleMerchantVerification } from "@/app/actions/admin_actions";
import { 
  Users, 
  Search, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  MoreHorizontal,
  Loader2,
  Download,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminExperts() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getAdminMerchants();
      setMerchants(data || []);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.sidebar.merchants}</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>全球專家神經網絡註冊表</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
             <input 
                type="text" 
                placeholder="搜尋姓名、店家或專業領域..." 
                style={{ 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '16px', 
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(184, 134, 11, 0.1)', 
                  fontSize: '14px',
                  width: '380px',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'border 0.2s'
                }} 
             />
           </div>
           <button style={{ 
             backgroundColor: '#ffffff', 
             color: '#0f172a', 
             padding: '0.875rem', 
             borderRadius: '16px', 
             border: '1px solid #e2e8f0', 
             cursor: 'pointer',
             boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
           }}>
             <Filter size={18} />
           </button>
           <button style={{ 
             backgroundColor: '#0f172a', 
             color: '#d4af37', 
             padding: '0.875rem 1.75rem', 
             borderRadius: '16px', 
             fontSize: '13px', 
             fontWeight: 900, 
             textTransform: 'uppercase', 
             letterSpacing: '0.08em', 
             cursor: 'pointer', 
             border: 'none', 
             display: 'flex', 
             alignItems: 'center', 
             gap: '0.6rem',
             boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
           }}>
             <Download size={18} />
             數據導出
           </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '2.5rem', 
        border: '1px solid rgba(184, 134, 11, 0.08)', 
        overflow: 'hidden', 
        boxShadow: '0 30px 70px rgba(0,0,0,0.04)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafbfc' }}>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>專家資料</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>專業領域 / 商號</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>資質狀態</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>營收營運</th>
              <th style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #f1f5f9' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={24} color="#d4af37" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ))
            ) : merchants.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '8rem 4rem', textAlign: 'center' }}>
                    <Users size={48} style={{ margin: '0 auto 1.5rem', color: '#d4af37', opacity: 0.2 }} />
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>目前專家目錄中尚無紀錄</p>
                </td>
              </tr>
            ) : (
              merchants.map((merchant) => (
                <tr key={merchant.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '16px', 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                        border: '1px solid rgba(212,175,55,0.2)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '15px', 
                        fontWeight: 900, 
                        color: '#d4af37',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        {merchant.name?.slice(0, 2).toUpperCase() || "UN"}
                      </div>
                      <div>
                         <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>{merchant.name || "未知專家"}</div>
                         <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{merchant.user?.email || "無電子郵件"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#334155' }}>
                        {merchant.companyName || "個人服務商"}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.08)', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRO NODE</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <VerificationLabel verified={merchant.isVerified} />
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>£{(merchant.revenue || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                        總計完成 {merchant.bookings?.length || 0} 筆預約
                    </div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem', textAlign: 'right' }}>
                    <button style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '12px', 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0', 
                      color: '#d4af37', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function VerificationLabel({ verified }: { verified: boolean }) {
  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '8px', 
      padding: '8px 16px', 
      borderRadius: '99px',
      backgroundColor: verified ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
      border: `1px solid ${verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}`
    }}>
       {verified ? (
         <>
           <ShieldCheck size={16} color="#10b981" />
           <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>已授權</span>
         </>
       ) : (
         <>
           <AlertCircle size={16} color="#f59e0b" />
           <span style={{ fontSize: '11px', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>核查中</span>
         </>
       )}
    </div>
  );
}
