/*
  Warnings:

  - You are about to drop the `artist_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `artists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credit_bundles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hotel_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hotels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `hotelId` on the `venues` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "artists_slug_key";

-- DropIndex
DROP INDEX "credit_bundles_slug_key";

-- DropIndex
DROP INDEX "hotels_slug_key";

-- DropIndex
DROP INDEX "membership_plans_slug_key";

-- DropIndex
DROP INDEX "packages_slug_key";

-- DropIndex
DROP INDEX "payments_creditBundleId_idx";

-- DropIndex
DROP INDEX "payments_packageId_idx";

-- DropIndex
DROP INDEX "payments_subscriptionId_idx";

-- DropIndex
DROP INDEX "payments_orderId_idx";

-- DropIndex
DROP INDEX "payments_userId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "artist_requests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "artists";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "contact_messages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "credit_bundles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hotel_requests";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "hotels";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "membership_plans";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "notifications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "packages";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "payments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "subscriptions";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_venues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "minCapacity" INTEGER NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "comparePrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "images" JSONB NOT NULL,
    "videos" JSONB,
    "features" JSONB NOT NULL,
    "amenities" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_venues" ("address", "amenities", "capacity", "city", "comparePrice", "country", "createdAt", "currency", "description", "features", "id", "images", "isActive", "location", "maxCapacity", "minCapacity", "name", "price", "rating", "reviewCount", "slug", "updatedAt", "videos") SELECT "address", "amenities", "capacity", "city", "comparePrice", "country", "createdAt", "currency", "description", "features", "id", "images", "isActive", "location", "maxCapacity", "minCapacity", "name", "price", "rating", "reviewCount", "slug", "updatedAt", "videos" FROM "venues";
DROP TABLE "venues";
ALTER TABLE "new_venues" RENAME TO "venues";
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
