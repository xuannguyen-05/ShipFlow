const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")
const { randomUUID } = require("crypto")

const createOrderService = async(data, user) => {

     // shipper không được tạo order
    if(user.role === "shipper"){
        throw new AppError("Not allowed", 403)
    }

    const customer = await prisma.customer.findFirst({
        where: { 
            customer_id: data.customer_id, 
            is_deleted: false 
        }
    })

    if (!customer) {
        throw new AppError("Customer not found", 404)
    }

    // check assigned user (nếu có)
    if (data.assigned_to) {
        const assignedUser  = await prisma.user.findUnique({
            where: { user_id: data.assigned_to }
        })

        if (!assignedUser ) {
            throw new AppError("Assigned user not found", 404)
        }
        
        if (assignedUser.role !== "shipper"){
            throw new AppError("Can only assign to shipper", 400)
        }
    }

    const order = await prisma.order.create({
        data: {
            order_code: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
            customer_id: data.customer_id,
            created_by: user.user_id,
            assigned_to: data.assigned_to ?? null,

            service_type: data.service_type,   
            origin: data.origin,
            destination: data.destination,

            etd: data.etd ?? null,
            eta: data.eta ?? null,

            status: "pending" 
        },
        include: {
            customer: true,
            creator: {
                select: {
                    user_id: true,
                    username: true
                }
            },
            assignee: {
                select: {
                    user_id: true,
                    username: true
                }
            }
        }
    })

    return order
}

const getOrdersService = async(page, limit, user) => {

    let whereCondition = {}

     // admin: all
    if(user.role === "admin"){
        whereCondition = {}
    }

    // staff: chỉ order mình tạo hoặc được assign
    if (user.role === "staff") {
        whereCondition = {
            created_by: user.user_id 
        }
    }

    // shipper: chỉ order được assign
    if (user.role === "shipper") {
        whereCondition = {
            assigned_to: user.user_id
        }
    }

    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            skip,
            take: safeLimit,
            where: whereCondition,
            orderBy: {
                created_at: "desc"
            },
            include: {
                customer: true,
                creator: {
                    select: {
                        user_id: true,
                        username: true
                    }
                },
                assignee: {
                    select: {
                        user_id: true,
                        username: true
                    }
                }
            }
        }),

        prisma.order.count({
            where: whereCondition
        })
    ])

    return {
        orders,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}

const getOrderByIdService = async(order_id, user) => {

    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    const order = await prisma.order.findUnique({
        where: {order_id},
        include: {
            customer: true,
            creator: {
                select: {
                    user_id: true,
                    username: true,
                    full_name: true
                }
            },
            assignee: {
                select: {
                    user_id: true,
                    username: true,
                    full_name: true
                }
            },
            status_logs: {
                orderBy: {created_at: "desc"}
            },
            documents: true,
            costs: true,
            payments: true
        }
    })

    if(!order){
        throw new AppError("Order Not Found", 404)
    }

    // shipper chỉ xem order được assign
    if (
        user.role === "shipper" &&
        order.assigned_to !== user.user_id
    ) {
        throw new AppError("Not allowed", 403)
    }

    // staff: chỉ xem order mình tạo
    if (user.role === "staff" && order.created_by !== user.user_id) {
        throw new AppError("Not allowed", 403)
    }

    return order
}

const updateOrderService = async(order_id, data, user) => {

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

    // permission
    if(user.role === "shipper"){
        throw new AppError("Not allowed", 403)
    }

    if(
        user.role === "staff" &&
        existingOrder.created_by !== user.user_id
    ){
        throw new AppError("Not allowed", 403)
    }

    if (!["pending", "confirmed"].includes(existingOrder.status)) {
        throw new AppError("Cannot update order at this stage", 400)
    }

    // check assigned_to (nếu có)
    if(data.assigned_to !== undefined){
        if (data.assigned_to === null && user.role === "staff") {
            throw new AppError("Staff cannot unassign order", 403)
        }else{
            const assignedUser  = await prisma.user.findUnique({
                where: { user_id: data.assigned_to }
            })

            if (!assignedUser ) {
                throw new AppError("Assigned user not found", 404)
            }
            
            if (assignedUser.role !== "shipper"){
                throw new AppError("Can only assign to shipper", 400)
            }
        }
    }

    const allowedFields = [
        "assigned_to",
        "service_type",
        "origin",
        "destination",
        "etd",
        "eta"
    ]

    const updateData = {}

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field]
        }
    }

    const updatedOrder = await prisma.order.update({
        where: { order_id },
        data: updateData
    })

    return updatedOrder
}

const updateAssignOrderService = async(order_id, data, user) => {

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

    // permission
    if(user.role === "shipper"){
        throw new AppError("Not allowed", 403)
    }

    if(
        user.role === "staff" &&
        existingOrder.created_by !== user.user_id
    ){
        throw new AppError("Not allowed", 403)
    }

    if (!["pending", "confirmed"].includes(existingOrder.status)) {
        throw new AppError("Cannot update order at this stage", 400)
    }

    // check assigned_to (nếu có)
    if(data.assigned_to !== undefined){
        if (data.assigned_to === null && user.role === "staff") {
            throw new AppError("Staff cannot unassign order", 403)
        }else{
            const assignedUser  = await prisma.user.findUnique({
                where: { user_id: data.assigned_to }
            })

            if (!assignedUser ) {
                throw new AppError("Assigned user not found", 404)
            }
            
            if (assignedUser.role !== "shipper"){
                throw new AppError("Can only assign to shipper", 400)
            }
        }
    }

    const updatedOrder  = await prisma.order.update({
        where: { order_id },
        data: {
            assigned_to: data.assigned_to
        }
    })

    return updatedOrder
}

const updateOrderStatusService = async(order_id, data, user) => {

    const rolePermissions = {
        admin: ["pending", "confirmed", "shipping", "delivered", "completed", "cancelled"],
        staff: ["pending", "confirmed", "shipping"],
        shipper: ["shipping", "delivered"]
    }

    const validTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipping", "cancelled"],
        shipping: ["delivered"],
        delivered: ["completed"]
    }

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

    const currentStatus = existingOrder.status
    const newStatus = data.status

    if(["completed", "cancelled"].includes(currentStatus)){
        throw new AppError("Order already finalized", 400)
    }

    //check role có được set status này ko
    if(!rolePermissions[user.role]?.includes(newStatus)){
        throw new AppError("Not allowed to set this status", 403)
    }

    //check ownership

    if(user.role === "shipper") {
        if(existingOrder.assigned_to !== user.user_id){
            throw new AppError("Not allowed", 403)
        }
    }

    if(user.role === "staff"){
        if(existingOrder.created_by !== user.user_id){
            throw new AppError("Not allowed", 403)
        }
    }
    
    //check transition hợp lệ
    if(!validTransitions[currentStatus]?.includes(newStatus)){
        throw new AppError("Invalid status transition", 400)
    }

    // update + log (transaction)
    const result = await prisma.$transaction(async (tx) => {

        const updatedOrder = await tx.order.update({
            where: {order_id},
            data: {status: newStatus}
        })

        await tx.orderStatusLog.create({
            data: {
                order_id,
                old_status: currentStatus,
                new_status: newStatus,
                changed_by: user.user_id
            }
        })

        return updatedOrder
    })

    return result
}

const getOrderStatusLogService = async (order_id, page, limit) => {
    if (Number.isNaN(order_id)) {
        throw new AppError("Invalid Order ID", 400)
    }

    const existingOrder = await prisma.order.findUnique({
        where: { order_id }
    })

    if (!existingOrder) {
        throw new AppError("Order not found", 404)
    }

    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [logs, total] = await Promise.all([
        prisma.orderStatusLog.findMany({
            where: { order_id },
            skip,
            take: safeLimit,
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: {
                    select: {
                        user_id: true,
                        username: true,
                        full_name: true
                    }
                }
            }
        }),

        prisma.orderStatusLog.count({
            where: { order_id }
        })
    ])

    return {
        logs,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}
module.exports = {
    createOrderService,
    getOrdersService,
    getOrderByIdService,
    updateOrderService,
    updateAssignOrderService,
    updateOrderStatusService,
    getOrderStatusLogService
}