import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Probe columns for critical tables
    const userColumns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`;
    const merchantColumns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Merchant'`;
    const bookingColumns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Booking'`;
    const walletColumns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'MerchantWallet'`;
    const transactionColumns = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'CreditTransaction'`;

    return NextResponse.json({
      User: (userColumns as any[]).map(c => c.column_name),
      Merchant: (merchantColumns as any[]).map(c => c.column_name),
      Booking: (bookingColumns as any[]).map(c => c.column_name),
      MerchantWallet: (walletColumns as any[]).map(c => c.column_name),
      CreditTransaction: (transactionColumns as any[]).map(c => c.column_name)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
