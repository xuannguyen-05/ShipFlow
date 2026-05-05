-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('order_created', 'order_assigned', 'order_unassigned', 'order_reassigned', 'order_status_updated', 'document_uploaded', 'document_deadline_updated', 'payment_added') NOT NULL;
