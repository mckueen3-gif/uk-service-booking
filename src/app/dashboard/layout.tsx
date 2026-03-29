import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Calendar, Wallet, User, Settings, ShieldCheck } from "lucide-react";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const isMerchant = (session as any)?.user?.role === "MERCHANT";

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2rem 1rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', position: 'sticky', top: '100px' }}>
          <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{isMerchant ? "Pro Dashboard" : "My Account"}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{session?.user?.name}</p>
          </div>
          
          <SidebarNav isMerchant={isMerchant} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
