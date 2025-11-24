-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photography_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" REAL,
    "comparePrice" REAL,
    "features" JSONB NOT NULL,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_photography_services" ("comparePrice", "createdAt", "description", "duration", "featured", "features", "id", "image", "name", "order", "price", "slug", "updatedAt") SELECT "comparePrice", "createdAt", "description", "duration", "featured", "features", "id", "image", "name", "order", "price", "slug", "updatedAt" FROM "photography_services";
DROP TABLE "photography_services";
ALTER TABLE "new_photography_services" RENAME TO "photography_services";
CREATE UNIQUE INDEX "photography_services_slug_key" ON "photography_services"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
