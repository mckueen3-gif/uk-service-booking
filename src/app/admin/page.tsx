import { prisma } from "@/lib/prisma";
import { ShoppingCart, Users, Banknote, TrendingUp, Clock, AlertCircle, Gavel, Sparkles, Scale } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [bookingCount, userCount, merchantCount, totalRevenue, disputeCount, pendingDisputes] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.merchant.count(),
    prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    prisma.dispute.count(),
    prisma.dispute.count({ where: { status: { in: ['OPEN', 'REVIEWING'] } } })
  ]);

  const stats = [
    { label: "總訂單量", value: bookingCount, icon: <ShoppingCart size={24} />, color: "#6366f1" },
    { label: "註冊用戶", value: userCount, icon: <Users size={24} />, color: "#10b981" },
    { label: "入駐商戶", value: merchantCount, icon: <Banknote size={24} />, color: "#f59e0b" },
    { label: "平台總流水", value: `£${(totalRevenue._sum.totalAmount || 0).toFixed(2)}`, icon: <TrendingUp size={24} />, color: "#ec4899" },
  ];

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: true, merchant: true }
  });

  return (
    <div>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontStyle: 'italic', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>平台指揮中心 <span style={{ color: 'var(--accent-color)' }}>Core</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>歡迎回來，管理員。這是平台目前的運營快照與爭議預警。</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
           <Link href="/admin/disputes" style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Gavel size={18} /> 處理爭議 ({pendingDisputes})
              </div>
           </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="hover-scale" style={{ 
            background: 'var(--surface-2)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '1.5rem', 
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: `${stat.color}15`, padding: '0.75rem', borderRadius: '1rem', color: stat.color }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>即時數據</span>
            </div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{stat.label}</h3>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={20} color="var(--accent-color)" /> 最近訂單儀表板</h2>
            <button style={{ fontSize: '0.875rem', color: 'var(--accent-color)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>查看全部</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentBookings.map((booking) => (
              <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--surface-1)', borderRadius: '1.25rem', border: '1px solid var(--border-color)', opacity: 0.9 }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 900 }}>{booking.customer.name?.[0] || 'U'}</div>
                   <div>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{booking.customer.name || "未命名用戶"}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>對象: {booking.merchant.companyName}</p>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.1rem' }}>£{booking.totalAmount}</p>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '0.5rem',
                    fontWeight: 800,
                    backgroundColor: booking.status === 'COMPLETED' ? '#10b98120' : '#f59e0b20',
                    color: booking.status === 'COMPLETED' ? '#10b981' : '#f59e0b'
                  }}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Stats & AI Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'linear-gradient(135deg, var(--accent-color) 0%, #312e81 100%)', borderRadius: '1.5rem', padding: '2rem', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={20} color="white" /> AI 仲裁效能
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                     <span style={{ opacity: 0.8 }}>自動化結案率 (AI Resolve)</span>
                     <span style={{ fontWeight: 800 }}>82%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                     <div style={{ width: '82%', height: '100%', background: 'white' }} />
                  </div>
               </div>
               <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.25rem' }}>平均處理時間</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>4.2 分鐘</div>
               </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Scale size={18} color="var(--text-muted)" /> 監促清單
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>待處理爭議</span>
                 <span style={{ fontWeight: 800, color: '#ef4444' }}>{pendingDisputes}</span>
              </li>
              <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>未審核商戶證照</span>
                 <span style={{ fontWeight: 800 }}>3</span>
              </li>
              <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                 <span>系統健康度</span>
                 <span style={{ fontWeight: 800, color: '#10b981' }}>正常</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}
