import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookingsContent from "./components/BookingsContent";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 🚀 INSTANT SHELL HEADER: Renders immediately */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          我的預約 <span style={{ color: 'var(--accent-color)' }}>Bookings</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>掌握您的完整預約歷史與即時服務狀態。</p>
      </div>

      <BookingsContent />
    </div>
  );
}
