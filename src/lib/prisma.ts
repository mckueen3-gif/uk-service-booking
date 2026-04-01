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
  // Each Vercel function should ideally take 1 connection.
  const pool = new Pool({ 
    max: 1, // Restored to 1 for serverless safety (with single-query optimization)
    connectionTimeoutMillis: 10000, 
    idleTimeoutMillis: 30000,
  });
  
  const adapter = new PrismaPg(pool as any);
  
  prismaClient = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }
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
      const isPoolIssue = errorStr.includes("pool") || errorStr.includes("client") || errorStr.includes("timeout") || errorStr.includes("6543");
      
      if (isPoolIssue && i < retries) {
        console.warn(`[Prisma Retry] Pool issue detected, retrying in ${delay}ms... (Attempt ${i+1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
