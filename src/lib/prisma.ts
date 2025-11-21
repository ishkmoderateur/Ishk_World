// CRITICAL: Override DATABASE_URL BEFORE importing PrismaClient
// This ensures Prisma uses SQLite even if system env has PostgreSQL
import path from "path";

// Only override if DATABASE_URL is not set or is not a SQLite file path
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("file:")) {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    console.warn("⚠️  Overriding non-SQLite DATABASE_URL with SQLite default");
    console.warn(`   System had: ${process.env.DATABASE_URL.substring(0, 50)}...`);
  }
  // Get absolute path to prisma/dev.db
  const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
  const sqliteUrl = `file:${dbPath.replace(/\\/g, "/")}`; // Normalize path separators for SQLite
  // Force SQLite for this project using absolute path
  process.env.DATABASE_URL = sqliteUrl;
  console.log(`✅ DATABASE_URL set to: ${sqliteUrl}`);
} else {
  // DATABASE_URL is already set to a file: path, use it as-is
  console.log(`✅ DATABASE_URL already set: ${process.env.DATABASE_URL}`);
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

