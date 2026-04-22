import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import EquipmentClient from "./EquipmentClient";

export const metadata: Metadata = {
  title: "Asset Control Panel | ConciergeAI",
  description: "AI-powered lifecycle management for your valuable assets. Track maintenance and health status.",
};

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/member/equipment");
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: {
          orderBy: { createdAt: "desc" }
        },
        vehicles: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const serializedProperties = (user?.properties || []).map((p: any) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    const serializedVehicles = (user?.vehicles || []).map((v: any) => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
      motDate: v.motDate?.toISOString() || null,
      lastService: v.lastService?.toISOString() || null,
    }));

    return (
      <EquipmentClient 
        initialProperties={serializedProperties} 
        initialVehicles={serializedVehicles} 
      />
    );
  } catch (err) {
    console.error("[EquipmentPage] Error:", err);
    return (
      <div className="container" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>Error loading assets</h2>
        <p>Please try again later.</p>
      </div>
    );
  }
}
