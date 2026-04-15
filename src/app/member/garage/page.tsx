import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GarageContent from "./components/GarageContent";

export default async function GaragePage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <GarageContent />
    </div>
  );
}
