import { Car, Clock, Settings, TrendingUp, ChevronRight, MapPin, Gauge, ShieldAlert } from 'lucide-react';
import VerifiedBadge from '@/app/components/VerifiedBadge';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MechanicDashboard() {
  const session = await getServerSession(authOptions) as any;
  if (!session?.user || (session.user as any).role !== 'MERCHANT') {
    redirect('/auth/signin');
  }

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id }
  });

  if (!merchant) {
    redirect('/');
  }

  // Fetch only car-related bookings for this specialized merchant
  const bookings = await (prisma.booking as any).findMany({
    where: {
      merchantId: session.user.id,
      vehicleReg: { not: null }
    },
    include: {
      service: true,
      customer: true
    },
    orderBy: { createdAt: 'desc' }
  }) as any[];

  const stats = {
    active: bookings.filter(b => b.status === 'PENDING' || b.status === 'IN_PROGRESS').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    revenue: bookings.reduce((acc, b) => acc + (b.status === 'COMPLETED' ? b.totalAmount : 0), 0)
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      
      {!merchant.isVerified && (
        <div className="glass-panel" style={{ 
          padding: '1.5rem 2rem', 
          marginBottom: '2.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderLeft: '4px solid #f59e0b'
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ShieldAlert color="#f59e0b" size={24} />
              <div>
                 <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>您的商家帳號尚未認證</div>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>通過認證可獲得「專業標章」並提升搜尋排名。</p>
              </div>
           </div>
           <Link href="/merchant/verification" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              立即去認證
           </Link>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
           <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             Mechanic Workshop
             {merchant.isVerified && <VerifiedBadge size={28} />}
           </h1>
           <p style={{ color: 'var(--text-secondary)' }}>Manage your vehicle repairs and automotive services.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className="glass-panel" style={{ padding: '1rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Jobs</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.active}</span>
           </div>
           <Link href="/merchant/availability" className="glass-panel hover-scale" style={{ padding: '1rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem', textDecoration: 'none', color: 'inherit', border: '1px solid var(--accent-color)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase' }}>服務時間</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Clock size={18} color="var(--accent-color)" />
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>設定</span>
              </div>
           </Link>
           <div className="glass-panel" style={{ padding: '1rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Completed</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.completed}</span>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {bookings.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
             <Car size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', opacity: 0.5 }} />
             <h3>No Automotive Bookings Yet</h3>
             <p style={{ color: 'var(--text-secondary)' }}>Once a customer books a car service with you, it will appear here.</p>
          </div>
        ) : (
          bookings.map(booking => (
            <Link key={booking.id} href={`/merchant/car/${booking.id}`} className="glass-panel hover-scale" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                     {booking.status}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                     <Clock size={14} /> {new Date(booking.scheduledDate).toLocaleDateString()}
                  </div>
               </div>

               <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{booking.service.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 700, fontSize: '1.1rem' }}>
                     <Car size={18} /> {booking.vehicleReg} - {booking.vehicleMake} {booking.vehicleModel}
                  </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        {booking.customer.name?.[0] || 'C'}
                     </div>
                     <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{booking.customer.name}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>£{booking.totalAmount}</div>
               </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
