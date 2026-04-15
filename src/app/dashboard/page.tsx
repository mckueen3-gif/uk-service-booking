import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Redirect based on role
  if (session.user.role === "MERCHANT" || session.user.role === "ADMIN") {
    redirect("/merchant");
  } else {
    redirect("/member");
  }
}
