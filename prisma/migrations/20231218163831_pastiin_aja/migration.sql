/*
  Warnings:

  - Added the required column `is_shared` to the `Frauds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Frauds" ADD COLUMN     "is_shared" BOOLEAN NOT NULL;
