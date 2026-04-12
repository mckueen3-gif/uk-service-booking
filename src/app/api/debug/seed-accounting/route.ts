import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Seeding Accounting category...");
    
    // Find a test merchant
    const merchant = await prisma.merchant.findFirst({
      where: { companyName: { contains: 'Test' } }
    });

    if (!merchant) {
      return NextResponse.json({ error: "No test merchant found" }, { status: 404 });
    }

    // Add the Accounting service
    const service = await prisma.service.create({
      data: {
        name: "Professional UK Ledger & Personal Tax Audit",
        description: "Expert assistance for small businesses and sole traders including VAT returns and year-end audits.",
        price: 450,
        category: "ACCOUNTING",
        merchantId: merchant.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Assigned Accounting service to ${merchant.companyName}`,
      service 
    });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
