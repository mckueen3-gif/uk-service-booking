import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PropertiesContent from "./components/PropertiesContent";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 🚀 INSTANT SHELL HEADER: Renders immediately */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          我的房產 <span style={{ color: 'var(--accent-color)' }}>Properties</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>管理您的各處物業，追蹤鍋爐、屋頂與設施狀態。</p>
      </div>

      <PropertiesContent />
    </div>
  );
}
