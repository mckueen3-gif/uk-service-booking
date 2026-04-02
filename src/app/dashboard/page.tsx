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
      {/* 🚀 INSTANT SHELL: Obsidian Gold Greeting (0ms) */}
      <section className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '2.5rem',
        background: 'rgba(5, 5, 5, 0.8)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.05)',
        backdropFilter: 'blur(16px)'
      }}>
        <DynamicGreeting userName={userName} />
        <p style={{ color: '#999', fontSize: '1.1rem', maxWidth: '600px', fontWeight: 500 }}>
          Welcome back to your elite dashboard. Your private concierge is active and synced.
        </p>
      </section>

      {/* 🚀 DYNAMIC CONTENT: Syncs silently without blocking the UI */}
      <DashboardContent initialData={null} />
    </div>
  );
}
