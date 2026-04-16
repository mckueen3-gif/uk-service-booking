import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

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
    max: 3, // Conservative but slightly expanded pool size
    connectionTimeoutMillis: 5000, 
    idleTimeoutMillis: 2000, // 🚀 AGGRESSIVE: Close idle connections after 2s of inactivity
  });
  
  const adapter = new PrismaPg(pool);
  
  prismaClient = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  
  // Cache globally in ALL environments to prevent leaks on warm invocations
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;

/**
 * 🚀 SILENT RESILIENCE: Helper to handle transient DB connection issues.
 * Enhanced with exponential backoff to handle "stuck queues" or server ripples.
 */
export async function safeDbQuery<T>(queryFn: () => Promise<T>, retries = 3, initialDelay = 400): Promise<T> {
  let lastError: Error | unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await queryFn();
    } catch (error: unknown) {
      lastError = error;
      const errorStr = error instanceof Error ? error.message : String(error);
      
      // Classify error type
      const isTransient = errorStr.includes("pool") || 
                          errorStr.includes("client") || 
                          errorStr.includes("timeout") || 
                          errorStr.includes("6543") || 
                          errorStr.includes("MaxClients") ||
                          errorStr.includes("connection");
      
      if (isTransient && i < retries) {
        // Exponential backoff: 400ms, 800ms, 1200ms...
        const currentDelay = initialDelay * (i + 1);
        console.warn(`[Prisma Retry ${i+1}/${retries}] Transient DB issue: ${errorStr.slice(0, 50)}... Retrying in ${currentDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        continue;
      }
      
      // If it's a structural/vertical data error, don't retry, just propagate
      throw error;
    }
  }
  throw lastError;
}
