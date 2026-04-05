import { getServerSession } from "next-auth/next";
/* 🚀 CACHE BUST: 2026-04-04 14:44 - FORCING GOLD REBUILD */
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WalletContent from "./components/WalletContent";

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 🚀 INSTANT SHELL HEADER: Renders immediately */}
      <div className="animate-fade-up" style={{ marginBottom: '0.5rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
          管理您的獎勵點數、優惠券與推薦計畫。
        </p>
      </div>

      <WalletContent />
    </div>
  );
}
