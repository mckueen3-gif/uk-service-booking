import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileContent from "./components/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) redirect("/auth/login");
  
  // 🚀 INSTANT SHELL: Server only fetches the bare minimum for layout
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { name: true }
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '5rem' }}>
      {/* 🚀 INSTANT TITLE: Renders immediately without waiting for full DB profile */}
      <div className="animate-fade-up" style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
          管理您的帳戶安全、聯絡方式以及商戶公開資訊。
        </p>
      </div>

      <ProfileContent initialUser={null} />
    </div>
  );
}
