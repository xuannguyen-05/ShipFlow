const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const createNotificationService = async({user_id, order_id, type, content}) => {
   return await prisma.notification.create({
        data: {
            user_id, 
            order_id,
            type,
            content
        }
    })
}

const getNotificationService = async(page, limit, user) => {
    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [notifs, total] = await Promise.all([
        prisma.notification.findMany({
            where: {user_id: user.user_id},
            orderBy: {
                created_at: "desc"
            },
            skip,
            take: safeLimit
        }),

        prisma.notification.count({
            where: {user_id: user.user_id}
        })
    ])

    return {
        notifications: notifs,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}

const getNotificationUnreadCountService = async(user) => {
    const count = await prisma.notification.count({
        where: {
            user_id: user.user_id,
            is_read: false
        }
    })

    return count
}

const updateNotificationReadService = async(notif_id, user) => {

    if (Number.isNaN(notif_id)) {
        throw new AppError("Invalid Notification ID", 400)
    }

    const notif = await prisma.notification.findFirst({
        where: {
            notif_id,
            user_id: user.user_id
        }
    })

    if(!notif){
        throw new AppError("Notification not found", 404)
    }

    const updated = await prisma.notification.update({
        where: {notif_id},
        data: {
            is_read: true
        }
    })

    return updated
}

const updateNotificationReadAllService = async(user) => {

    const updated = await prisma.notification.updateMany({
        where: {
            user_id: user.user_id,
            is_read: false
        },
        data: {
            is_read: true
        }
    })

    return updated
}


module.exports = {
    createNotificationService, 
    getNotificationService, 
    getNotificationUnreadCountService, 
    updateNotificationReadService,
    updateNotificationReadAllService
}