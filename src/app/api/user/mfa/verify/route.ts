import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TOTP } from "otplib";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token } = await request.json();

    if (!token || token.length !== 6) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { mfaSecret: true, mfaEnabled: true }
    });

    if (!user?.mfaSecret) {
      return NextResponse.json({ error: "MFA Setup not initiated" }, { status: 400 });
    }

    // Manually instantiate TOTP for consistency and stability
    const totp = new TOTP();
    // Check if valid token
    // Cast to any to fix type checking failure in Next.js build.
    const isValid = (totp as any).check(token, user.mfaSecret);

    if (isValid) {
      // Finalize MFA enablement
      await prisma.user.update({
        where: { id: session.user.id },
        data: { mfaEnabled: true }
      });

      console.log(`[MFA] Successfully verified and enabled for user ${session.user.id}`);

      return NextResponse.json({ success: true });
    } else {
      console.warn(`[MFA] Invalid token provided for user ${session.user.id}`);
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("MFA verification error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error?.message || "Unknown error"
    }, { status: 500 });
  }
}
