-- AlterTable
ALTER TABLE "donations" ADD COLUMN "images" JSONB;
ALTER TABLE "donations" ADD COLUMN "videos" JSONB;

-- AlterTable
ALTER TABLE "photography_bookings" ADD COLUMN "images" JSONB;
ALTER TABLE "photography_bookings" ADD COLUMN "videos" JSONB;

-- AlterTable
ALTER TABLE "products" ADD COLUMN "videos" JSONB;

-- AlterTable
ALTER TABLE "venues" ADD COLUMN "videos" JSONB;
