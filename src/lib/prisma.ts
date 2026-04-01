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
