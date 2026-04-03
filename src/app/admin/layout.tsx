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
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const t = getDictionary('zh-TW'); // Locked to zh-TW per request

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      color: '#0f172a',           
      transition: 'all 0.3s ease' 
    }}>
      <div style={{ position: 'fixed', top: '10px', right: '10px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4d4f', zIndex: 9999, boxShadow: '0 0 10px rgba(255,77,79,0.5)' }}></div>
      
      <aside style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#d4af37' }}>ADMIN <span style={{ color: '#0f172a' }}>UK</span></span>
        </div>

        <nav style={{ 
          flex: 1, 
          padding: '1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px', 
          marginTop: '1rem', 
          overflowY: 'auto' 
        }}>
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={20} />} label={t.admin.sidebar.overview} />
          <AdminNavLink href="/admin/analytics" icon={<BarChart3 size={20} />} label={t.admin.sidebar.analytics} />
          <AdminNavLink href="/admin/bookings" icon={<CalendarDays size={20} />} label={t.admin.sidebar.bookings} />
          <AdminNavLink href="/admin/verifications" icon={<ShieldCheck size={20} />} label={t.admin.sidebar.verifications} badge="3" />
          <AdminNavLink href="/admin/disputes" icon={<Gavel size={20} />} label={t.admin.sidebar.disputes} badge="需審核" />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }}></div>
          <AdminNavLink href="/admin/merchants" icon={<Users size={20} />} label={t.admin.sidebar.merchants} />
          <AdminNavLink href="/admin/payouts" icon={<CreditCard size={20} />} label={t.admin.sidebar.payouts} badge="最新" />
          <AdminNavLink href="/admin/settings" icon={<Settings size={20} />} label={t.admin.sidebar.settings} />
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '12px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0' 
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '99px', 
              backgroundColor: '#0f172a', 
              border: '1px solid rgba(212,175,55,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37' }}>AD</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{session.user.name || "管理員"}</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, margin: 0 }}>{t.admin.sidebar.terminal}</p>
            </div>
            <Link href="/api/auth/signout" style={{ color: '#64748b' }}>
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '280px', padding: '2.5rem', backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>{t.admin.header.internal}</h1>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{t.admin.header.operations}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ 
              padding: '0.75rem', 
              borderRadius: '50%', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              color: '#64748b',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#d4af37', borderRadius: '50%', border: '2px solid #fff' }}></span>
            </button>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }}></div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.admin.header.node}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>London, UK</p>
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
        padding: '0.75rem 1.25rem', 
        borderRadius: '0.75rem', 
        color: '#64748b', // Slate muted
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 600,
        transition: 'all 0.2s',
        marginBottom: '4px'
      }}
    >
      <span style={{ color: '#d4af37' }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#d4af37', color: 'black' }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
