-- CreateTable
CREATE TABLE "site_media" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "alt" VARCHAR(255),
    "data" BYTEA NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER NOT NULL,
    "caption" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "highlight" VARCHAR(60),
    "description" TEXT NOT NULL,
    "valid_from" DATE,
    "valid_until" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "media_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(6) NOT NULL,
    "ends_at" TIMESTAMP(6),
    "venue" VARCHAR(255),
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "media_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "course_interest" VARCHAR(160),
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_gallery_sort" ON "gallery_images"("sort_order");

-- CreateIndex
CREATE INDEX "idx_offers_active" ON "offers"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "idx_site_events_starts" ON "site_events"("starts_at");

-- CreateIndex
CREATE INDEX "idx_enquiries_status" ON "enquiries"("status", "created_at");

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "site_media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "site_media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_events" ADD CONSTRAINT "site_events_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "site_media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

