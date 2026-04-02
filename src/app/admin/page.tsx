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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <StatCard 
          title="Active Disputes" 
          value={activeDisputes.toString()} 
          icon={<Activity size={24} />} 
          trend="Tribunal" 
          description="Awaiting arbitration"
          isWarning={activeDisputes > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Alert Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#1a1a1a] shadow-sm dark:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-[#d4af37]" size={20} />
              Critical Verifications
            </h3>
            <button className="text-xs font-bold text-[#d4af37] hover:underline uppercase tracking-widest">
              View All Queue
            </button>
          </div>
          
          <div className="space-y-4">
            {pendingDocs === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 italic">No pending verifications. All clear!</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#d4af37]/10 flex items-center justify-between group cursor-pointer hover:border-[#d4af37]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-center text-[#d4af37]">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Merchant Documentation Review</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">{pendingDocs} files awaiting adjudication</p>
                  </div>
                </div>
                <ArrowUpRight className="text-gray-600 group-hover:text-[#d4af37] transition-colors" />
              </div>
            )}
          </div>
        </div>

        {/* System Activity Hub (LIVE PULSE) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#1a1a1a] shadow-sm dark:shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <LivePulse />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, description, highlight, isWarning }: any) {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      highlight 
        ? 'bg-gradient-to-br from-white to-slate-50 dark:from-[#121212] dark:to-[#0a0a0a] border-[#d4af37]/30 shadow-sm dark:shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
        : 'bg-white dark:bg-[#0d0d0d] border-slate-100 dark:border-[#1a1a1a] shadow-sm'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-[#d4af37] text-black shadow-lg' : 'bg-[#141414] text-[#d4af37] border border-[#1a1a1a]'}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase ${
          isWarning ? 'bg-red-500/10 text-red-500' : 'bg-[#d4af37]/10 text-[#d4af37]'
        }`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{value}</p>
        <p className="text-xs text-slate-400 dark:text-gray-500">{description}</p>
      </div>
    </div>
  );
}

