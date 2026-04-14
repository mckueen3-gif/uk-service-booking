import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  if (role === "MERCHANT") {
    redirect("/merchant");
  } else if (role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/member");
  }

  // Fallback
  return null;
}
