import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session: any = null;
  try {
    session = (await getServerSession(authOptions).catch(() => null)) as any;
  } catch (err) {
    console.error("Layout Session Error:", err);
    // If layout itself fails, we still want to show something safe
  }

  if (!session) {
    redirect("/auth/login");
  }

  const isMerchant = session?.user?.role === "MERCHANT";
  const userName = session?.user?.name || "User";

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar - Fixed Left */}
      <aside style={{ 
        width: '280px', 
        height: 'calc(100vh - 80px)', // Account for top navbar
        position: 'fixed',
        left: 0,
        top: '80px', // Start below navbar
        padding: '2rem 1.5rem',
        borderRight: '1px solid var(--border-color)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2.5rem', paddingLeft: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '-0.03em' }}>
            ConciergeAI<span style={{ color: 'var(--text-primary)' }}>.</span>
          </h1>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isMerchant ? 'Vetted Expert' : 'Premier Member'}
          </p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <SidebarNav isMerchant={isMerchant} userName={userName} />
        </div>
      </aside>

      {/* Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
        <main style={{ padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
