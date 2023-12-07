/*
  Warnings:

  - You are about to drop the `Detections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Detections" DROP CONSTRAINT "Detections_user_id_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Detections";

-- CreateTable
CREATE TABLE "Frauds" (
    "detection_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text_input" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "image_input" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Frauds_pkey" PRIMARY KEY ("detection_id")
);

-- AddForeignKey
ALTER TABLE "Frauds" ADD CONSTRAINT "Frauds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
