const asyncHandler = require("../../utils/asyncHandler")
const {
    getNotificationService, 
    getNotificationUnreadCountService, 
    updateNotificationReadService,
    updateNotificationReadAllService
} = require("./notification.service")

const getNotification = asyncHandler(async(req, res) => {

    const {page = 1, limit = 10} = req.query

    const notifs = await getNotificationService(page, limit, req.user)

    res.status(200).json({
        message: "Get notifications successfully", 
        data: notifs
    })
})

const getNotificationUnreadCount = asyncHandler(async(req, res) => {

    const count = await getNotificationUnreadCountService(req.user)

    res.status(200).json({
        message: "Get notification unread count successfully", 
        data: count
    })
})

const updateNotificationRead = asyncHandler(async(req, res) => {

    const notif_id = +req.params.id

    const result = await updateNotificationReadService(notif_id, req.user)

    res.status(200).json({
        message: "Notification marked as read", 
        data: result
    })
})

const updateNotificationReadAll = asyncHandler(async(req, res) => {

    const result = await updateNotificationReadAllService(req.user)

    res.status(200).json({
        message: "All notifications marked as read", 
        data: result
    })
})


module.exports = {getNotification, getNotificationUnreadCount, updateNotificationRead, updateNotificationReadAll}