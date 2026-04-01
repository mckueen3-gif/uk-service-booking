import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Wallet, 
  Settings, 
  ShieldCheck, 
  Clock,
  Zap,
  TrendingUp,
  PieChart
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function StatCard({ icon, label, value, trend, mode }: { icon: any, label: string, value: string, trend?: string, mode?: string }) {
  const accentColor = mode === 'merchant' ? '#3b82f6' : (mode === 'payout' ? '#10b981' : '#f59e0b');
  
  return (
    <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: accentColor, backgroundColor: `${accentColor}15`, padding: '0.75rem', borderRadius: '12px' }}>
          {icon}
        </div>
        {trend && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{value}</h3>
    </div>
  );
}

function ActivityItem({ title, time, status }: { title: string, time: string, status: string }) {
  const statusColor = status === 'COMPLETED' ? '#10b981' : (status === 'PENDING' ? '#f59e0b' : '#3b82f6');

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor }} />
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>{title}</p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{time}</p>
        </div>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {status}
      </span>
    </div>
  );
}

function HyperResilientFallback({ errorCode }: { errorCode: string }) {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', background: '#fefce8', border: '2px dashed #facc15', borderRadius: '24px' }}>
      <Clock size={48} color="#eab308" style={{ margin: '0 auto 1.5rem' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Dashboard is in Hyper-Resilient Mode</h2>
      <p style={{ color: '#854d0e', marginBottom: '1.5rem' }}>Some data services are currently being optimized. Your core functions remain safe.</p>
      <div style={{ fontSize: '0.7rem', color: '#ca8a04', opacity: 0.7 }}>Ref Code: {errorCode}</div>
    </div>
  );
}

export default async function DashboardOverview() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    // Pre-isolate data fetching for extreme resilience
    let userData: any = null;
    let merchantData: any = null;
    let bookingsData: any[] = [];
    let errorLog: string[] = [];

    // 1. Fetch User Stats (Hyper-Isolated)
    try {
      userData = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          notifications: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              title: true,
              message: true,
              type: true,
              isRead: true,
              createdAt: true
            }
          }
        }
      });
    } catch (e) { 
      console.error("Dashboard DB Error [User]:", e); 
      errorLog.push("USER_DB_FAIL");
    }

    // 2. Fetch Merchant Profile (Hyper-Isolated)
    try {
      merchantData = await prisma.merchant.findUnique({
        where: { userId: (session.user as any).id },
        select: {
          id: true,
          isVerified: true,
          wallet: {
            select: {
              totalEarned: true,
              pendingBalance: true
            }
          }
        }
      }) as any;
    } catch (e) {
      console.error("Dashboard DB Error [Merchant]:", e);
      errorLog.push("MERCHANT_DB_FAIL");
    }

    // 3. Fetch Bookings (Hyper-Isolated)
    try {
      bookingsData = await prisma.booking.findMany({
        where: { 
          OR: [
            { customerId: (session.user as any).id },
            { merchantId: merchantData?.id || 'none' }
          ]
        },
        select: {
          id: true,
          scheduledDate: true,
          status: true,
          service: {
            select: {
              id: true,
              name: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { scheduledDate: 'desc' },
        take: 5
      });
    } catch (e) {
      console.error("Dashboard DB Error [Bookings]:", e);
      errorLog.push("BOOKINGS_DB_FAIL");
    }

    const isMerchant = (session?.user as any)?.role === 'MERCHANT';
    const displayName = session?.user?.name || "User";

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Section */}
        {/* Header Section (Simplified) */}
        <div className="animate-fade-up" style={{ marginBottom: '0.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
            {errorLog.length > 0 ? `System Note: Partial service active (${errorLog.join(', ')})` : `Welcome back, ${displayName}. Here's what's happening today.`}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <StatCard 
            icon={<Clock size={24} />} 
            label="Pending Tasks" 
            value={isMerchant ? "3" : "1"} 
            trend="+1 this week"
            mode="merchant"
          />
          <StatCard 
            icon={<PieChart size={24} />} 
            label="Total Earnings" 
            value={isMerchant ? `£${merchantData?.wallet?.totalEarned?.toFixed(2) || "0.00"}` : "£0.00"} 
            trend="Referral active"
            mode="payout"
          />
          <StatCard 
            icon={<ShieldCheck size={24} />} 
            label="Status" 
            value={merchantData?.isVerified ? "Verified" : "Pending"} 
            trend="Expert Level"
            mode="status"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Main Activity Area */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={24} color="var(--accent-color)" /> Recent Activity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookingsData.length > 0 ? (
                bookingsData.map((booking) => (
                  <ActivityItem 
                    key={booking.id}
                    title={booking.service?.name || "Service Booking"}
                    time={new Date(booking.scheduledDate).toLocaleDateString()}
                    status={booking.status}
                  />
                ))
              ) : (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No recent activity found.</p>
              )}
            </div>
          </div>

          {/* Quick Actions Area */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white', border: '1px dashed #e2e8f0' }}>
             {/* Timeline Area Placeholder */}
             <div style={{ opacity: 0.5, textAlign: 'center', padding: '4rem 0' }}>
                <Clock size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                <p style={{ fontWeight: 600, color: '#64748b' }}>Maintenance Timeline</p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Real-time updates are initializing...</p>
             </div>
          </div>
        </div>
      </div>
    );
  } catch (criticalError) {
    console.error("Dashboard CRITICAL CRASH:", criticalError);
    return <HyperResilientFallback errorCode="DB-CRIT-999" />;
  }
}
