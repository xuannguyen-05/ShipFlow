const { createNotificationService } = require("./notification.service")
const {generateNotificationContent} = require("../../utils/notification.helper")
const { emitNotification } = require("../../utils/socket.helper")

const notify = async({user_id, order_id, type, data = {}}) => {
    const content = generateNotificationContent(type, data)

    const notif = await createNotificationService({
        user_id,
        order_id,
        type,
        content
    })

    // socket AFTER create
    emitNotification(user_id, notif)

    return notif
}

module.exports = { notify }