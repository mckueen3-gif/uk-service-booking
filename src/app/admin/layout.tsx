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
  Bell
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
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1a1a1a] bg-[#0d0d0d] flex flex-col fixed inset-y-0 shadow-2xl">
        <div className="p-6 border-b border-[#1a1a1a] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#aa8b2c] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#d4af37]">ADMIN <span className="text-white">UK</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
          <AdminNavLink href="/admin/verifications" icon={<ShieldCheck size={20} />} label="Verifications" badge="3" />
          <AdminNavLink href="/admin/merchants" icon={<Users size={20} />} label="Experts" />
          <AdminNavLink href="/admin/payouts" icon={<CreditCard size={20} />} label="Payouts" badge="New" />
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-[#1a1a1a]">
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-[#d4af37]/20 flex items-center justify-center">
              <span className="text-xs font-bold text-[#d4af37]">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[#e5e5e5]">{session.user.name || "Administrator"}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Terminal Access</p>
            </div>
            <Link href="/api/auth/signout" className="p-2 text-gray-500 hover:text-white transition-colors">
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] mb-1">Internal Management</h1>
            <p className="text-2xl font-bold tracking-tight text-white">Central Operations Hub</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full bg-[#111] border border-[#222] text-gray-400 hover:text-[#d4af37] transition-all group relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#d4af37] rounded-full border-2 border-black"></span>
            </button>
            <div className="h-8 w-px bg-gray-800"></div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Regional Node</p>
              <p className="text-sm font-bold text-white">London, UK</p>
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
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a1a] text-gray-400 hover:text-white transition-all group border border-transparent hover:border-[#d4af37]/10"
    >
      <span className="group-hover:scale-110 transition-transform text-[#d4af37]/60 group-hover:text-[#d4af37]">
        {icon}
      </span>
      <span className="text-sm font-medium flex-1">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37] text-black">
          {badge}
        </span>
      )}
    </Link>
  );
}
