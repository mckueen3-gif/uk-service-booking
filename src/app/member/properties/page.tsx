import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PropertiesContent from "./components/PropertiesContent";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <PropertiesContent />
    </div>
  );
}
