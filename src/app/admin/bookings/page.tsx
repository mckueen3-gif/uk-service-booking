import { prisma } from "@/lib/prisma";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Search,
  Filter
} from "lucide-react";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      customer: true, 
      merchant: true,
      service: true
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>訂單管理 (Booking Management)</h1>
          <p style={{ color: '#94a3b8' }}>檢視與管理平台上的所有服務預約。</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
            <input 
              type="text" 
              placeholder="搜尋訂單 ID..." 
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '0.75rem', color: 'white', outline: 'none', width: '300px' }}
            />
          </div>
          <button style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <Filter size={18} /> 篩選
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>訂單 ID / 客戶</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>商戶 / 服務</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>金額</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>狀態</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>#{booking.id.slice(-6)}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{booking.customer.name} ({booking.customer.email})</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ color: 'white', fontWeight: 600 }}>{booking.merchant.companyName}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{booking.service.name}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'white', fontWeight: 800 }}>
                  £{booking.totalAmount.toFixed(2)}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.4rem 0.75rem', 
                    borderRadius: '2rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    backgroundColor: booking.status === 'COMPLETED' ? '#05966920' : booking.status === 'PENDING' ? '#d9770620' : '#ef444420',
                    color: booking.status === 'COMPLETED' ? '#34d399' : booking.status === 'PENDING' ? '#fbbf24' : '#f87171',
                    border: `1px solid ${booking.status === 'COMPLETED' ? '#05966950' : booking.status === 'PENDING' ? '#d9770650' : '#ef444450'}`
                  }}>
                    {booking.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '0.5rem', color: '#94a3b8' }}>
                      <ExternalLink size={16} />
                    </button>
                    {booking.status !== 'COMPLETED' && (
                       <button style={{ backgroundColor: '#059669', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                         完工結算
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
            目前尚無任何訂單紀錄。
          </div>
        )}
      </div>
    </div>
  );
}
