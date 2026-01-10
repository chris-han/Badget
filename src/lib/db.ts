import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma Client Singleton
 *
 * This ensures we reuse a single PrismaClient instance across the application,
 * preventing connection pool exhaustion in serverless/Next.js environments.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Test connection on first import in development
if (process.env.NODE_ENV === "development" && !globalForPrisma.prisma) {
  prisma.$connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((error) => console.error("❌ Database connection failed:", error));
}

export default prisma;
