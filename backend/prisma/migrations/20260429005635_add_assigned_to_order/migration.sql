-- AlterTable
ALTER TABLE `order` ADD COLUMN `assigned_to` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
