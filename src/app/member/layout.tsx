export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/SidebarNav";
import { dictionaries, Locale, Dictionary } from "@/lib/i18n/dictionary";
import { cookies } from "next/headers";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) return null; // Middleware handles the redirect now

  const isMerchant = session.user.role === "MERCHANT";
  const userName = session.user.name || "Member";

  // 🚀 i18n for Sidebar (Shielded)
  const cookieStore = await cookies();
  const locale = (cookieStore.get('user-locale')?.value as Locale) || 'en';
  const t = (dictionaries[locale] || dictionaries['en'] || {}) as Dictionary;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex' }}>
      <aside style={{ 
        width: '280px', 
        height: 'calc(100vh - 80px)', 
        position: 'fixed',
        left: 0,
        top: '80px', 
        padding: '2rem 1.5rem',
        borderRight: '1px solid var(--border-color)',
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2.5rem', paddingLeft: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '-0.03em' }}>
            ConciergeAI<span style={{ color: 'var(--text-primary)' }}>.</span>
          </h1>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMerchant ? (t?.common?.specialistNode || "Specialist Node") : (t?.common?.premierMember || "Premier Member")}
          </p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <SidebarNav isMerchant={isMerchant} userName={userName} isIsolated={true} />
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
        <main style={{ padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
