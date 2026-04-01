import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

async function getCols(tableName: string) {
  try {
     // Try a direct query to get one record and see keys
     const record = await (prisma as any)[tableName.charAt(0).toLowerCase() + tableName.slice(1)].findFirst();
     if (record) return Object.keys(record);
     
     // Fallback to information_schema with various case variations
     const res: any[] = await prisma.$queryRawUnsafe(`
       SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = '${tableName}' 
          OR table_name = '${tableName.toLowerCase()}'
          OR table_name = '${tableName.toLowerCase()}s'
     `);
     return res.map(c => c.column_name);
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function GET() {
  try {
    const results = {
      User: await getCols('User'),
      Merchant: await getCols('Merchant'),
      Booking: await getCols('Booking'),
      MerchantWallet: await getCols('MerchantWallet'),
      CreditTransaction: await getCols('CreditTransaction'),
      Notification: await getCols('Notification'),
      SystemInfo: {
        time: new Date().toISOString(),
        env: process.env.NODE_ENV,
        deployId: 'v1.1-fix-db-and-greeting'
      }
    };

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
