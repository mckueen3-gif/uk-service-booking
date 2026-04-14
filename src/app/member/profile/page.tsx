import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma, safeDbQuery } from "@/lib/prisma";
import ProfileContent from "./components/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;
  
  const userId = (session.user as any).id;

  // 🚀 DB RESILIENCE: Wrap in safeDbQuery to handle pool saturations
  let userWithBasicInfo = null;
  try {
    userWithBasicInfo = await safeDbQuery(() => prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        referralCode: true,
        referralCredits: true,
        createdAt: true,
      }
    }));
  } catch (e) {
    console.warn("[Profile] Server pre-fetch failed, falling back to client sync.");
  }

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '5rem' }}>
      {/* If DB fetch failed, pass session data as a placeholder */}
      <ProfileContent initialUser={userWithBasicInfo || session.user} />
    </div>
  );
}
