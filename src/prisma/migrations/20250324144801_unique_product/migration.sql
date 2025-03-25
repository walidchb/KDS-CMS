/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `DynamicProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DynamicProduct_productId_key" ON "DynamicProduct"("productId");
