import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "./components/DashboardContent";
import DynamicGreeting from "./components/DynamicGreeting";
import { cookies } from "next/headers";
import { dictionaries, Locale, Dictionary } from "@/lib/i18n/dictionary";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  // 🚀 i18n for Server Component (Shielded)
  const cookieStore = await cookies();
  const locale = (cookieStore.get('user-locale')?.value as Locale) || 'en';
  // 🚀 ROBUST FALLBACK: Ensure t is never undefined even on server
  const t = (dictionaries[locale] || dictionaries['en'] || {}) as Dictionary;

  // 🚀 TOTAL INSTANT SHELL
  const userName = session.user.name || "Member";

  return (
    <div className="animate-fade-up" style={{ minHeight: '100%' }}>
      {/* 🚀 INSTANT SHELL: Premium Pearl Gold Greeting (0ms) */}
      <section className="glass-panel" style={{ 
        padding: '2.5rem', 
        borderRadius: '32px', 
        marginBottom: '2.5rem',
        background: 'var(--soft-gradient)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        boxShadow: '0 10px 40px rgba(184, 134, 11, 0.1), 0 0 0 1px rgba(184, 134, 11, 0.05)',
        backdropFilter: 'blur(16px)'
      }}>
        <DynamicGreeting userName={userName} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', fontWeight: 600 }}>
          {t?.customer_dashboard?.welcomeBack || "Welcome back to your dashboard."}
        </p>
      </section>

      {/* 🚀 DYNAMIC CONTENT: Protected rendering shell */}
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <DashboardContent initialData={null} />
      </div>
    </div>
  );
}
