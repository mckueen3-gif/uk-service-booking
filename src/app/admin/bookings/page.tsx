"use client";

import { useEffect, useState } from "react";
import { getAdminBookings } from "@/app/actions/admin_actions";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Package,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getAdminBookings();
      setBookings(data || []);
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
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.bookings.title}</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>{t.admin.bookings.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
             <input 
               type="text" 
               placeholder={t.admin.bookings.search}
               style={{ 
                  padding: '0.875rem 1rem 0.875rem 3rem', 
                  borderRadius: '16px', 
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(184, 134, 11, 0.1)', 
                  fontSize: '14px',
                  width: '350px',
                  outline: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
               }} 
             />
           </div>
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
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.bookings.id}</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.bookings.customer}</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.bookings.service}</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.bookings.amount}</th>
              <th style={{ padding: '1.75rem 2rem', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: '1px solid #f1f5f9' }}>{t.admin.bookings.status}</th>
              <th style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #f1f5f9' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={24} color="#d4af37" style={{ margin: '0 auto' }} /></td></tr>
              ))
            ) : bookings.length === 0 ? (
               <tr>
                 <td colSpan={6} style={{ padding: '8rem 4rem', textAlign: 'center' }}>
                    <Package size={48} style={{ margin: '0 auto 1.5rem', color: '#d4af37', opacity: 0.2 }} />
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>暫無預訂紀錄</p>
                 </td>
               </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(212,175,55,0.05)', 
                      color: '#d4af37', 
                      fontFamily: 'monospace', 
                      fontSize: '11px', 
                      fontWeight: 900,
                      display: 'inline-block',
                      border: '1px solid rgba(212,175,55,0.1)'
                    }}>
                        #{booking.id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>{booking.customer?.name || "未知用戶"}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{booking.customer?.email}</div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#334155' }}>{booking.service?.name || booking.serviceName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Node: {booking.merchant?.companyName || booking.merchantId?.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>£{booking.amount}</span>
                  </td>
                  <td style={{ padding: '1.75rem 2rem' }}>
                    <StatusBadge status={booking.status} />
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
                      justifyContent: 'center'
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

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    COMPLETED: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '已完成' },
    PENDING: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '處理中' },
    CANCELLED: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', text: '已取消' },
    PAID: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.08)', text: '已付款' }
  };

  const config = configs[status] || { color: '#94a3b8', bg: '#f8fafc', text: status };

  return (
    <span style={{ 
      padding: '6px 14px', 
      borderRadius: '999px', 
      fontSize: '11px', 
      fontWeight: 900, 
      color: config.color, 
      backgroundColor: config.bg,
      border: `1px solid ${config.color}20`,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {config.text}
    </span>
  );
}
