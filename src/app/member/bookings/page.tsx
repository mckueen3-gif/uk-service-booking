import { cookies } from "next/headers";
import { dictionaries, Locale } from "@/lib/i18n/dictionary";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  const cookieStore = await cookies();
  const locale = (cookieStore.get('user-locale')?.value as Locale) || 'en';
  const t = (dictionaries[locale] || dictionaries['en'] || {}) as any;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 🚀 INSTANT SHELL HEADER: Renders immediately */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {t?.sidebar?.labels?.bookings || "My Bookings"}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {t?.merchant?.bookings?.subtitle || "Manage your services and history."}
        </p>
      </div>

      <BookingsContent />
    </div>
  );
}
