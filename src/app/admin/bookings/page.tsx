"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/lib/actions/admin";
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
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getDictionary('zh-TW');

  useEffect(() => {
    async function load() {
      const data = await getBookings();
      setBookings(data);
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.admin.bookings.title}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>{t.admin.bookings.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
             <input 
               type="text" 
               placeholder={t.admin.bookings.search}
               style={{ 
                 padding: '0.6rem 1rem 0.6rem 2.5rem', 
                 borderRadius: '12px', 
                 border: '1px solid #e2e8f0', 
                 fontSize: '14px',
                 width: '300px',
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
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.bookings.id}</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.bookings.customer}</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.bookings.service}</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.bookings.amount}</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.admin.bookings.status}</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td colSpan={6} style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={24} color="#d4af37" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ))
            ) : bookings.length === 0 ? (
               <tr>
                 <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>
                   暫無預訂紀錄
                 </td>
               </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#d4af37', fontFamily: 'monospace' }}>#{booking.id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{booking.customer?.name || "未知用戶"}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{booking.customer?.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{booking.serviceName}</div>
                    <div style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>專家 ID: {booking.merchantId?.slice(0, 8)}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>£{booking.amount}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <StatusBadge status={booking.status} />
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

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    COMPLETED: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: '已完成' },
    PENDING: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: '處理中' },
    CANCELLED: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: '已取消' },
    PAID: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.1)', text: '已付款' }
  };

  const config = configs[status] || { color: '#94a3b8', bg: '#f1f5f9', text: status };

  return (
    <span style={{ 
      padding: '4px 12px', 
      borderRadius: '999px', 
      fontSize: '10px', 
      fontWeight: 900, 
      color: config.color, 
      backgroundColor: config.bg,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {config.text}
    </span>
  );
}
