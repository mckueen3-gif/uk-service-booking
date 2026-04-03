import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  Wallet,
  Activity
} from "lucide-react";
import { LivePulse } from "@/components/admin/LivePulse";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch real-time metrics
  const totalMerchants = await prisma.merchant.count();
  const pendingDocs = await prisma.merchantDocument.count({
    where: { status: { in: ["PENDING", "UNDER_ADMIN_REVIEW"] } }
  });
  const activeDisputes = await prisma.dispute.count({
    where: { status: "OPEN" }
  });
  
  // Calculate total platform earnings from the platformFee field
  const completedBookings = await prisma.booking.findMany({
    where: { status: "COMPLETED" },
    select: { 
      totalAmount: true,
      platformFee: true 
    }
  });
  
  const totalGMV = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformRevenue = completedBookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI Section - Physical Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '1rem'
      }}>
        <StatCard 
          title="Platform Revenue" 
          value={`£${platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={<TrendingUp size={24} />} 
          trend="+12.5%" 
          description="9% total commission"
          highlight
        />
        <StatCard 
          title="Total Experts" 
          value={totalMerchants.toString()} 
          icon={<Users size={24} />} 
          trend="+4" 
          description="Verified specialists"
        />
        <StatCard 
          title="Pending Reviews" 
          value={pendingDocs.toString()} 
          icon={<Clock size={24} />} 
          trend="Action required" 
          description="Verification backlog"
          isWarning={pendingDocs > 0}
        />
        <StatCard 
          title="GMV processed" 
          value={`£${totalGMV.toLocaleString()}`} 
          icon={<Wallet size={24} />} 
          trend="Live flow" 
          description="Total booking value"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Verification Alert Section */}
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '1.25rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
              <ShieldAlert style={{ color: '#d4af37' }} size={20} />
              Critical Verifications
            </h3>
            <button style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All Queue
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingDocs === 0 ? (
              <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>No pending verifications. All clear!</p>
              </div>
            ) : (
              <div style={{ 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                backgroundColor: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Merchant Documentation Review</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{pendingDocs} files awaiting adjudication</p>
                  </div>
                </div>
                <ArrowUpRight style={{ color: '#94a3b8' }} size={20} />
              </div>
            )}
          </div>
        </div>

        {/* System Activity Hub (LIVE PULSE) */}
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '1.25rem', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <LivePulse />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, description, highlight, isWarning }: any) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      borderRadius: '1.25rem', 
      border: highlight ? '1px solid #d4af37' : '1px solid #e2e8f0', 
      backgroundColor: '#ffffff',
      boxShadow: highlight ? '0 10px 25px rgba(212,175,55,0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
      transition: 'transform 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '0.75rem', 
          backgroundColor: highlight ? '#d4af37' : '#f8fafc', 
          color: highlight ? 'white' : '#d4af37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: highlight ? '0 4px 12px rgba(212,175,55,0.3)' : 'none'
        }}>
          {icon}
        </div>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: 800, 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: isWarning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
          color: isWarning ? '#ef4444' : '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {trend}
        </span>
      </div>
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem', margin: 0 }}>{title}</p>
        <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', margin: 0, letterSpacing: '-0.025em' }}>{value}</p>
        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

