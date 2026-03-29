import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = "postgresql://postgres.nrufveuqktjkyqeidnta:CnP%_UQdpYNKa9x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
console.log('[Prisma Init] HARDCODED URL ACTIVE');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires driver adapters when the URL is decoupled from the schema
let prismaClient: PrismaClient;

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma;
} else {
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 5000, // 5 second timeout
    idleTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool as any);
  prismaClient = new PrismaClient({ 
    adapter,
    log: ['query', 'error', 'warn']
  } as any);
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
