-- CreateTable
CREATE TABLE "ProductCustomImage" (
    "productId" TEXT NOT NULL,
    "customImageId" TEXT NOT NULL,

    CONSTRAINT "ProductCustomImage_pkey" PRIMARY KEY ("productId","customImageId")
);

-- AddForeignKey
ALTER TABLE "ProductCustomImage" ADD CONSTRAINT "ProductCustomImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCustomImage" ADD CONSTRAINT "ProductCustomImage_customImageId_fkey" FOREIGN KEY ("customImageId") REFERENCES "customImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
