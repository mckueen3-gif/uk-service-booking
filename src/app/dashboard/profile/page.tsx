import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileContent from "./components/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) redirect("/auth/login");
  
  // 🚀 INSTANT SHELL: Server only fetches the bare minimum for layout
  const userWithBasicInfo = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
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
  });

  if (!userWithBasicInfo) redirect("/auth/login");

  return (
    <div className="animate-fade-up" style={{ paddingBottom: '5rem' }}>
      <ProfileContent initialUser={userWithBasicInfo} />
    </div>
  );
}
