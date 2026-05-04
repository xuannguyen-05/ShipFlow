const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const createNotificationService = async(order_id, user_id, type, content) => {
   return await prisma.notification.create({
        data: {
            user_id, 
            order_id,
            type,
            content
        }
    })
}

module.exports = {createNotificationService}