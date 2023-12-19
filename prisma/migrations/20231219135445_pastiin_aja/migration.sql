/*
  Warnings:

  - Changed the type of `result` on the `Frauds` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Frauds" DROP COLUMN "result",
ADD COLUMN     "result" DOUBLE PRECISION NOT NULL;
