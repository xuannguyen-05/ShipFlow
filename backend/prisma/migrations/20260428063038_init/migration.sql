-- AlterTable
ALTER TABLE `user` ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;
