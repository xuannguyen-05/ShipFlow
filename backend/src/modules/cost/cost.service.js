const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const addCostService = async(order_id, data) => {
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
        throw new AppError("Cannot add cost to finalized order", 400)
    }

    if (data.amount <= 0) {
        throw new AppError("Invalid amount", 400)
    }

    const [cost] = await prisma.$transaction([
        prisma.cost.create({
        data: {
            order_id,
            type: data.type,
            amount: data.amount
        }
        }),

        prisma.order.update({
        where: { order_id },
        data: {
            total_cost: {
            increment: data.amount
            }
        }
        })
    ])

    return cost
}

const getCostService = async(order_id) => {

    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    const order = await prisma.order.findUnique({
        where: {order_id}
    })

    if(!order){
        throw new AppError("Order not found", 404)
    }

    const costs = await prisma.cost.findMany({
        where: {order_id}
    })
    return costs
}

module.exports = {addCostService, getCostService}