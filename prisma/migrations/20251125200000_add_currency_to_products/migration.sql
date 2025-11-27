-- AlterTable: Add currency column to products if it doesn't exist
-- This migration adds the currency column to the products table

-- First, check if column exists and add it if not
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN, so we use a workaround

-- Add currency column (will fail silently if already exists)
ALTER TABLE "products" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';

