"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/admin_actions";
import { 
  Users, 
  Search, 
  User, 
  MoreHorizontal, 
  Shield, 
  Calendar,
  Activity,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getUsers();
      setUsers(data || []);
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.admin.sidebar.users}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>客戶與合作夥伴權限節點數據庫</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
             <input 
               type="text" 
               placeholder="按姓名、Email 或手機號碼搜尋..." 
               style={{ 
                 padding: '0.6rem 1rem 0.6rem 2.5rem', 
                 borderRadius: '12px', 
                 border: '1px solid #e2e8f0', 
                 fontSize: '14px',
                 width: '320px',
                 outline: 'none'
               }} 
             />
           </div>
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
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>客戶概況</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>身份權限</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>註冊日期</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>活躍狀態</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                  目前尚無用戶數據庫紀錄
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                        <User size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{user.name || "未登錄姓名"}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '999px', backgroundColor: user.role === 'MERCHANT' ? 'rgba(212,175,55,0.1)' : 'rgba(59,130,246,0.1)', color: user.role === 'MERCHANT' ? '#d4af37' : '#3b82f6', fontWeight: 900, textTransform: 'uppercase' }}>
                      {user.role === 'MERCHANT' ? '專家合作夥伴' : '普通客戶'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: 700 }}>
                      {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>正常通訊</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}>
                      <MoreHorizontal size={18} />
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
