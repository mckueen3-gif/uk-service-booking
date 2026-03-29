import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingCart, BarChart3, Settings, LogOut, ShieldCheck } from "lucide-react";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Self-healing: Ensure at least one admin exists
  // We check only once in dev mode
  if (process.env.NODE_ENV !== "production") {
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
        await (prisma.user.create as any)({
            data: {
                email: 'admin@servicehub.uk',
                name: 'Super Admin',
                password: hashedPassword,
                role: 'ADMIN',
                referralCode: 'PLATFORM-ADMIN'
            }
        });
        console.log("Seeded initial admin account");
    }
  }

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const navItems = [
    { label: "控制台總覽", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "訂單管理", href: "/admin/bookings", icon: <ShoppingCart size={20} /> },
    { label: "商戶審核", href: "/admin/merchants", icon: <ShieldCheck size={20} /> },
    { label: "用戶清單", href: "/admin/users", icon: <Users size={20} /> },
    { label: "佣金統計", href: "/admin/commissions", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        backgroundColor: '#1e293b', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <div style={{ backgroundColor: '#6366f1', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <ShieldCheck size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>後台系統</h2>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Management</p>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.875rem 1rem', 
                    borderRadius: '0.75rem', 
                    color: '#94a3b8', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-slate-800 hover:text-white"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            color: '#f43f5e',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            <LogOut size={20} /> 返回前台
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '2.5rem' }}>
        {children}
      </main>
    </div>
  );
}
