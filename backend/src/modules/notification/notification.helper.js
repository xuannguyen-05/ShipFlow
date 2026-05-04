const { createNotificationService } = require("./notification.service")
const generateNotificationContent = require("../../utils/notification.helper")

const notify = async(order_id, user_id, type, data = {}) => {
    const content = generateNotificationContent(type, data)

    return createNotificationService({
        order_id,
        user_id,
        type,
        content
    })
}

module.exports = { notify }