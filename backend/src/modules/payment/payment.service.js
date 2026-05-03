const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const addPaymentService = async(order_id, data, user) => {
    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    // check order tồn tại
    const existingOrder = await prisma.order.findUnique({
        where: { order_id }
    })

    if (!existingOrder) {
        throw new AppError("Order not found", 404)
    }

    if (["completed", "cancelled"].includes(existingOrder.status)) {
        throw new AppError("Cannot add payment to finalized order", 400)
    }

    if(data.amount <= 0){
        throw new AppError("Invalid amount", 400)
    }

    const [payment] = await prisma.$transaction([
        prisma.payment.create({
            data: {
                order_id,
                amount: data.amount,
                method: data.method,
                created_by: user.user_id
            }
        }),

        prisma.order.update({
            where: {order_id},
            data: {
                total_paid: {
                    increment: data.amount
                }
            }
        })
    ])

    return payment
}

const getPaymentService = async (order_id) => {

    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    const order = await prisma.order.findUnique({
        where: {order_id}
    })

    if(!order){
        throw new AppError("Order not found", 404)
    }

    const payments = await prisma.payment.findMany({
        where: { order_id },
        orderBy: {
            created_at: "desc"
        }
    })

    return {
        payments
    }
}

module.exports = {addPaymentService, getPaymentService}