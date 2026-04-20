import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
  Gavel,
  Newspaper,
  Sparkles
} from "lucide-react";
import { getDictionary, dictionaries, Locale } from "@/lib/i18n/dictionary";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

function AdminNavLink({ href, icon, label, badge, active }: { href: string; icon: React.ReactNode; label: string; badge?: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.875rem', 
        padding: '0.875rem 1.25rem', 
        borderRadius: '1rem', 
        color: active ? '#0f172a' : '#64748b',
        backgroundColor: active ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: active ? 700 : 600,
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        marginBottom: '4px',
        border: active ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
        boxShadow: active ? '0 4px 12px rgba(212, 175, 55, 0.05)' : 'none'
      }}
    >
      <span style={{ 
        color: active ? '#d4af37' : '#94a3b8',
        transition: 'color 0.2s'
      }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ 
          padding: '2px 8px', 
          borderRadius: '99px', 
          fontSize: '10px', 
          fontWeight: 800, 
          backgroundColor: active ? '#d4af37' : '#f1f5f9', 
          color: active ? 'white' : '#64748b',
          boxShadow: active ? '0 2px 4px rgba(212, 175, 55, 0.2)' : 'none'
        }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const locale = (cookieStore.get('user-locale')?.value as Locale) || 'zh-TW';
  const t = dictionaries[locale] || dictionaries['zh-TW'];

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/auth/login?callbackUrl=/admin&error=AccessDenied");
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      color: '#0f172a',           
    }}>
      {/* Status Dot */}
      <div style={{ position: 'fixed', top: '15px', right: '15px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', zIndex: 9999, boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)' }}></div>
      
      <aside style={{ 
        width: '280px', 
        height: '100vh', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid rgba(184, 134, 11, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(184, 134, 11, 0.25)'
          }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#d4af37', letterSpacing: '-0.02em' }}>ADMIN<span style={{ color: '#0f172a' }}> HUB</span></span>
        </div>

        <nav style={{ 
          flex: 1, 
          padding: '1.5rem 1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2px', 
          overflowY: 'auto' 
        }}>
           <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 1.25rem', marginBottom: '0.75rem' }}>{t.admin.sidebar.groups.core}</div>
           <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />} label={t.admin.sidebar.overview} active />
           <AdminNavLink href="/admin/analytics" icon={<BarChart3 size={18} />} label={t.admin.sidebar.analytics} />
           <AdminNavLink href="/admin/bookings" icon={<CalendarDays size={18} />} label={t.admin.sidebar.bookings} />
           
           <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 1.25rem', margin: '1.5rem 0 0.75rem' }}>{t.admin.sidebar.groups.audit}</div>
           <AdminNavLink href="/admin/verifications" icon={<ShieldCheck size={18} />} label={t.admin.sidebar.verifications} badge="3" />
           <AdminNavLink href="/admin/disputes" icon={<Gavel size={18} />} label={t.admin.sidebar.disputes} badge={t.admin.sidebar.badges.needsReview} />
           
           <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 1.25rem', margin: '1.5rem 0 0.75rem' }}>{t.admin.sidebar.groups.business}</div>
           <AdminNavLink href="/admin/merchants" icon={<Users size={18} />} label={t.admin.sidebar.labels.merchants} />
           <AdminNavLink href="/admin/marketing" icon={<Sparkles size={18} />} label={t.admin.sidebar.labels.marketing} />
           <AdminNavLink href="/admin/payouts" icon={<CreditCard size={18} />} label={t.admin.sidebar.labels.payouts} />
           <AdminNavLink href="/admin/blog" icon={<Newspaper size={18} />} label={t.admin.sidebar.labels.blog} />
           <AdminNavLink href="/admin/settings" icon={<Settings size={18} />} label={t.admin.settings_mgr.title} />
           <AdminNavLink href="/admin/commissions" icon={<Settings size={18} />} label={t.admin.sidebar.settings} />
        </nav>

        <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            borderRadius: '16px', 
            backgroundColor: '#f8fafc', 
            border: '1px solid rgba(184, 134, 11, 0.05)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: '#0f172a',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#d4af37' }}>AD</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{session?.user?.name || t.admin.sidebar.adminLabel}</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, margin: 0 }}>{t?.admin?.sidebar?.terminal || "Terminal"}</p>
            </div>
            <Link href="/api/auth/signout" style={{ color: '#64748b', padding: '8px', borderRadius: '8px', display: 'flex', transition: 'background 0.2s' }}>
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '280px', padding: '2.5rem 3.5rem', position: 'relative' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '3rem',
          padding: '1.5rem 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: '1px solid rgba(184, 134, 11, 0.05)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div>
            <h1 style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>{t?.admin?.header?.internal || "INTERNAL"}</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>{t?.admin?.header?.operations || "Operations"}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t?.admin?.header?.node || "Node"}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>London - LHR-01</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }}></div>
            <button style={{ 
              padding: '0.75rem', 
              borderRadius: '14px', 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              color: '#d4af37',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2.5px solid #fff', boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)' }}></span>
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
