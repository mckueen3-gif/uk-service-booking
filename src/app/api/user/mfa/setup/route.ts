import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TOTP } from "otplib";
import qrcode from "qrcode";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, mfaEnabled: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.mfaEnabled) return NextResponse.json({ error: "MFA already enabled" }, { status: 400 });

    // Ensure we have a valid email for the QR code
    const userEmail = user.email || "user@conciergeai.uk";
    
    // Manually instantiate TOTP to bypass singleton export issues
    const totp = new TOTP();
    
    // 1. Generate a new secret
    const secret = totp.generateSecret();
    
    // 2. Generate the keyuri (Required for QR codes)
    const service = "ConciergeAI UK";
    // Important: In otplib instance, keyuri is a method that takes 3 params.
    // Casting to any to fix type checking failure in Next.js build.
    const otpauth = (totp as any).keyuri(userEmail, service, secret);

    // 3. Generate QR Code Data URL
    const qrDataUrl = await qrcode.toDataURL(otpauth);

    // 4. Persistence: Save secret to database (waiting for verification)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { mfaSecret: secret }
    });

    console.log(`[MFA] Setup initiated for user ${session.user.id}`);

    return NextResponse.json({
      secret,
      qrDataUrl,
      otpauth
    });
  } catch (error: any) {
    console.error("MFA setup error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error?.message || "Unknown error" 
    }, { status: 500 });
  }
}
