/*
  Warnings:

  - Added the required column `public_id` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Made the column `file_url` on table `document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    MODIFY `file_url` VARCHAR(500) NOT NULL;
