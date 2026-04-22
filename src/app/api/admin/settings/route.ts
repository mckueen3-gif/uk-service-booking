import { NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await safeDbQuery(() => 
      prisma.platformSettings.upsert({
        where: { id: "global" },
        update: {},
        create: { id: "global" },
      })
    );
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const settings = await safeDbQuery(() => 
      prisma.platformSettings.upsert({
        where: { id: "global" },
        update: {
          companyName: body.companyName,
          officeAddress: body.officeAddress,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          companyRegistration: body.companyRegistration,
          vatRegistration: body.vatRegistration,
          facebookUrl: body.facebookUrl,
          twitterUrl: body.twitterUrl,
          instagramUrl: body.instagramUrl,
          linkedinUrl: body.linkedinUrl,
          defaultCommissionRate: body.defaultCommissionRate ? parseFloat(body.defaultCommissionRate) : undefined,
        },
        create: {
          id: "global",
          companyName: body.companyName,
          officeAddress: body.officeAddress,
          contactPhone: body.contactPhone,
          contactEmail: body.contactEmail,
          companyRegistration: body.companyRegistration,
          vatRegistration: body.vatRegistration,
          facebookUrl: body.facebookUrl,
          twitterUrl: body.twitterUrl,
          instagramUrl: body.instagramUrl,
          linkedinUrl: body.linkedinUrl,
          defaultCommissionRate: body.defaultCommissionRate ? parseFloat(body.defaultCommissionRate) : 0.10,
        },
      })
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
