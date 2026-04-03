"use client";

import { useEffect, useState } from "react";
import { getMerchants } from "@/lib/actions/admin";
import { 
  Users, 
  Search, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  MoreHorizontal,
  Loader2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminExperts() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

  useEffect(() => {
    async function load() {
      const data = await getMerchants();
      setMerchants(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.admin.sidebar.merchants}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>全球專家神經網絡註冊表</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
             <input 
               type="text" 
               placeholder="按名稱、電子郵件、行業搜尋專家..." 
               style={{ 
                 padding: '0.6rem 1rem 0.6rem 2.5rem', 
                 borderRadius: '12px', 
                 border: '1px solid #e2e8f0', 
                 fontSize: '14px',
                 width: '350px',
                 outline: 'none'
               }} 
             />
           </div>
           <button style={{ backgroundColor: '#0f172a', color: '#d4af37', padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Download size={16} />
             數據導出
           </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '1.5rem', 
        border: '1px solid #e2e8f0', 
        overflow: 'hidden', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.02)' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>專家資料</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>專業領域 / 商號</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>資質狀態</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>營收營運</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={24} color="#d4af37" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ))
            ) : merchants.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                  目前專家目錄中尚無紀錄
                </td>
              </tr>
            ) : (
              merchants.map((merchant) => (
                <tr key={merchant.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#d4af37' }}>
                        {merchant.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{merchant.name || "未知專家"}</div>
                         <div style={{ fontSize: '12px', color: '#94a3b8' }}>{merchant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{merchant.businessName || "個人服務商"}</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(212,175,55,0.1)', color: '#d4af37', fontWeight: 800 }}>PRO Node</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <VerificationLabel verified={merchant.isVerified} />
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>£{(merchant.revenue || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>累計完成: {merchant.completedBookings || 0}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}>
                      <ExternalLink size={18} />
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
       {verified ? (
         <>
           <ShieldCheck size={16} color="#10b981" />
           <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>已核准</span>
         </>
       ) : (
         <>
           <AlertCircle size={16} color="#f59e0b" />
           <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>驗證中</span>
         </>
       )}
    </div>
  );
}
