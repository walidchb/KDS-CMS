-- DropForeignKey
ALTER TABLE "DynamicProduct" DROP CONSTRAINT "DynamicProduct_productId_fkey";

-- AddForeignKey
ALTER TABLE "DynamicProduct" ADD CONSTRAINT "DynamicProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
