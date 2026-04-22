export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/SidebarNav";
import Link from "next/link";

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) return null; // Middleware handles the redirect now
  
  // Security: Ensure only merchants or admins access this route group
  // Verified by middleware, but kept for type-safe role determination
  const isMerchant = session.user.role === "MERCHANT";
  const isAdmin = session.user.role === "ADMIN";

  const userName = session.user.name || "Merchant";

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
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '-0.03em' }}>
              ConciergeAI<span style={{ color: 'var(--text-primary)' }}>.</span>
            </h1>
          </Link>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Expert Dashboard
          </p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <SidebarNav isMerchant={true} userName={userName} isIsolated={true} />
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
