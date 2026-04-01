import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardContent from "./components/DashboardContent";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  // WE STILL FETCH INITIAL DATA ON SERVER FOR SEO/FIRST LOAD
  // But we wrap the dynamic parts so they don't block the shell if slow
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, name: true, role: true }
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="animate-fade-up">
      {/* 🚀 INSTANT SHELL: Banner and Title render immediately */}
      <section className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          早安，<span style={{ color: 'var(--accent-color)' }}>{user.name || '使用者'}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          歡迎回到您的專屬控制面板。數據與預約正在後台即時更新中。
        </p>
      </section>

      {/* 🚀 DYNAMIC CONTENT: Streams in or uses client-side fetching */}
      <DashboardContent initialData={null} />
    </div>
  );
}
