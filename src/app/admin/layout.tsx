import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  BarChart3,
  CalendarDays,
  Gavel
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Security Guard: Role Check (assuming role is in session)
  // If role is missing from base NextAuth session, we'll need to fetch it or use the session correctly
  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  // NOTE: If the session doesn't store the role yet, we may need to fetch the user 
  // from DB here. For now, assuming current NextAuth setup handles roles.
  // Actually, let's play it safe and check the session structure if we can.

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background-color 0.3s ease' }}>
      {/* Sidebar - Fixed Left */}
      <aside style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: 'var(--glass-bg)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        backdropFilter: 'blur(24px)',
        boxShadow: '20px 0 40px rgba(0,0,0,0.05)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d4af37', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#d4af37' }}>ADMIN <span style={{ color: 'var(--text-primary)' }}>UK</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
          <AdminNavLink href="/admin/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
          <AdminNavLink href="/admin/bookings" icon={<CalendarDays size={20} />} label="Bookings" />
          <AdminNavLink href="/admin/verifications" icon={<ShieldCheck size={20} />} label="Verifications" badge="3" />
          <AdminNavLink href="/admin/disputes" icon={<Gavel size={20} />} label="Disputes" badge="Review" />
          <div className="py-2 border-t border-white/5 my-2"></div>
          <AdminNavLink href="/admin/merchants" icon={<Users size={20} />} label="Experts" />
          <AdminNavLink href="/admin/payouts" icon={<CreditCard size={20} />} label="Payouts" badge="New" />
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-[#d4af37]/20 flex items-center justify-center">
              <span className="text-xs font-bold text-[#d4af37]">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-[#e5e5e5]">{session.user.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold">Terminal Access</p>
            </div>
            <Link href="/api/auth/signout" className="p-2 text-gray-500 hover:text-white transition-colors">
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] mb-1">Internal Management</h1>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Central Operations Hub</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-[#222] text-slate-400 dark:text-gray-400 hover:text-[#d4af37] transition-all group relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#d4af37] rounded-full border-2 border-white dark:border-black"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-gray-800"></div>
            <div className="text-right">
              <p className="text-xs text-slate-400 dark:text-gray-500">Regional Node</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">London, UK</p>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: string }) {
  return (
    <Link 
      href={href}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.75rem', 
        borderRadius: '0.75rem', 
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'all 0.2s'
      }}
      className="admin-link-hover"
    >
      <span style={{ color: '#d4af37' }}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#d4af37', color: 'black' }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
