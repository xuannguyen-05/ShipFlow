-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('pending', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled') NOT NULL;

-- AlterTable
ALTER TABLE `orderstatuslog` MODIFY `old_status` ENUM('pending', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled') NULL,
    MODIFY `new_status` ENUM('pending', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled') NOT NULL;
