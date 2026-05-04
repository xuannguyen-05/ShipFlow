const { NotificationType } = require("@prisma/client")

const generateNotificationContent = (type, data = {}) => {
  switch (type) {
    case NotificationType.order_created:
      return `New order ${data.order_code} has been created`

    case NotificationType.order_assigned:
      return `You have been assigned to order ${data.order_code}`

    case NotificationType.order_status_updated:
      return `Order ${data.order_code} updated to ${data.status}`

    case NotificationType.document_uploaded:
      return `New document uploaded for order ${data.order_code}`

    case NotificationType.document_deadline_updated:
      return `Document deadline updated to ${data.deadline}`

    case NotificationType.payment_added:
      return `Payment of ${data.amount} added to order ${data.order_code}`

    default:
      return "You have a new notification"
  }
}

module.exports = { generateNotificationContent }