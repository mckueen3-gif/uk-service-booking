import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "./components/DashboardContent";
import DynamicGreeting from "./components/DynamicGreeting";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  // 🚀 TOTAL INSTANT SHELL: No more blocking DB calls here.
  // We use data from the session for the immediate greeting.
  const userName = session.user.name || "使用者";

  return (
    <div className="animate-fade-up">
      {/* 🚀 INSTANT SHELL: Banner and Title render IMMEDIATELY (0ms) */}
      <section className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <DynamicGreeting userName={userName} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
          Welcome back to your personalized dashboard. Real-time sync active.
        </p>
      </section>

      {/* 🚀 DYNAMIC CONTENT: Syncs silently without blocking the UI */}
      <DashboardContent initialData={null} />
    </div>
  );
}
