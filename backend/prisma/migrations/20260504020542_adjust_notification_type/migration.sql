/*
  Warnings:

  - The values [status,payment,deadline] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('order_created', 'order_assigned', 'order_status_updated', 'document_uploaded', 'document_deadline_updated', 'payment_added') NOT NULL;
