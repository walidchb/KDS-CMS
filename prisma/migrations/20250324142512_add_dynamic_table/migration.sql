-- CreateTable
CREATE TABLE "DynamicProduct" (
    "id" SERIAL NOT NULL,
    "fields" JSONB NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "DynamicProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DynamicProduct" ADD CONSTRAINT "DynamicProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
