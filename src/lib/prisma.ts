// CRITICAL: Only override DATABASE_URL in development if not set
// In production, use the DATABASE_URL from environment variables
import path from "path";

// Only override in development if DATABASE_URL is not set
if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  // Get absolute path to prisma/dev.db for local development
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  const sqliteUrl = `file:${dbPath.replace(/\\/g, "/")}`; // Normalize path separators for SQLite
  process.env.DATABASE_URL = sqliteUrl;
  console.log(`✅ Development: DATABASE_URL set to: ${sqliteUrl}`);
} else if (process.env.DATABASE_URL) {
  // Log the database URL (but mask password for security)
  const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
  console.log(`✅ DATABASE_URL configured: ${maskedUrl.substring(0, 80)}...`);
} else {
  console.error("❌ DATABASE_URL is not set! This is required in production.");
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Clear cached client if it exists to ensure fresh initialization with correct DATABASE_URL
if (globalForPrisma.prisma) {
  delete globalForPrisma.prisma;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

