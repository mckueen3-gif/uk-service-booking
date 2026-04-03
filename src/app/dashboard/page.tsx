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
      {/* 🚀 INSTANT SHELL: Premium Pearl Gold Greeting (0ms) */}
      <section className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #e9d5a3 100%)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 10px 40px rgba(184, 134, 11, 0.1), 0 0 0 1px rgba(184, 134, 11, 0.05)',
        backdropFilter: 'blur(16px)'
      }}>
        <DynamicGreeting userName={userName} />
        <p style={{ color: '#554411', fontSize: '1.1rem', maxWidth: '600px', fontWeight: 600 }}>
          Welcome back to your elite dashboard. Your private concierge is active and synced.
        </p>
      </section>

      {/* 🚀 DYNAMIC CONTENT: Syncs silently without blocking the UI */}
      <DashboardContent initialData={null} />
    </div>
  );
}
