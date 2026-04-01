import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%25_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient;

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma;
} else {
  // For Serverless, we MUST limit the pool size. 
  // Serverless functions should aggressively limit connection count
  const pool = new Pool({ 
    connectionString,
    max: 1, // MUST be 1 for Serverless to prevent pool exhaustion 
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 10000,
  });
  
  const adapter = new PrismaPg(pool as any);
  
  prismaClient = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  } as any);
  
  // Cache globally in ALL environments to prevent leaks on warm invocations
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;

/**
 * 🚀 SILENT RESILIENCE: Helper to handle transient DB connection issues.
 * This prevents "Pool Saturated" errors from leaking to the UI immediately.
 * We retry up to 2 times with a short delay before giving up.
 */
export async function safeDbQuery<T>(queryFn: () => Promise<T>, retries = 2, delay = 300): Promise<T> {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await queryFn();
    } catch (error: any) {
      lastError = error;
      const errorStr = String(error);
      const isPoolIssue = errorStr.includes("pool") || errorStr.includes("client") || errorStr.includes("timeout") || errorStr.includes("6543") || errorStr.includes("MaxClients");
      
      if (isPoolIssue && i < retries) {
         // Force garbage collection of old connections by letting Node breathe
        console.warn(`[Prisma Retry] DB Pool busy, waiting ${delay * (i+1)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
