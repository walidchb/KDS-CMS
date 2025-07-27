-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ref" TEXT,
ADD COLUMN     "specName" TEXT;

-- CreateTable
CREATE TABLE "customImage" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "customImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customImage_id_key" ON "customImage"("id");
