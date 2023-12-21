/*
  Warnings:

  - The primary key for the `Frauds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `detection_id` on the `Frauds` table. All the data in the column will be lost.
  - You are about to drop the column `image_input` on the `Frauds` table. All the data in the column will be lost.
  - Added the required column `fraud_id` to the `Frauds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Frauds" DROP CONSTRAINT "Frauds_pkey",
DROP COLUMN "detection_id",
DROP COLUMN "image_input",
ADD COLUMN     "fraud_id" TEXT NOT NULL,
ADD COLUMN     "image_link" TEXT,
ADD CONSTRAINT "Frauds_pkey" PRIMARY KEY ("fraud_id");
