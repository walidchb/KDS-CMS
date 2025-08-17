/*
  Warnings:

  - You are about to drop the column `stepFour` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stepOne` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stepThree` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stepTwo` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stepFour",
DROP COLUMN "stepOne",
DROP COLUMN "stepThree",
DROP COLUMN "stepTwo",
ADD COLUMN     "technicalSheet" TEXT;
