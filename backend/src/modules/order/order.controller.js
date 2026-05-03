const asyncHandler = require("../../utils/asyncHandler")
const {toOrderSummary, toOrderDetail} = require('./order.mapper')
const {
    createOrderService,
    getOrdersService,
    getOrderByIdService,
    updateOrderService,
    updateAssignOrderService,
    updateOrderStatusService,
    getOrderStatusLogService
} = require('./order.service')

const createOrder = asyncHandler(async(req, res) => {

    const order = await createOrderService(req.body, req.user)

    res.status(201).json({
        message: "Create order successfully", 
        data: toOrderDetail(order)
    })
})

const getOrder = asyncHandler(async(req, res) => {

    const { page = 1, limit = 10 } = req.query

    const result = await getOrdersService(page, limit, req.user)

    res.status(200).json({
        message: "Get orders successfully", 
        data: result.orders.map(toOrderSummary),
        meta: result.pagination
    })
})

const getOrderById = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const order = await getOrderByIdService(order_id, req.user)

    res.status(200).json({
        message: "Get order detail successfully", 
        data: toOrderDetail(order)
    })
})

const updateOrder = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const order = await updateOrderService(order_id, req.body, req.user)

    res.status(200).json({
        message: "Update order successfully", 
        data: toOrderDetail(order)
    })
})

const updateAssignOrder = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const order = await updateAssignOrderService(order_id, req.body, req.user)

    res.status(200).json({
        message: "Assign order successfully", 
        data: toOrderDetail(order)
    })
})

const updateOrderStatus = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const order = await updateOrderStatusService(order_id, req.body, req.user)

    res.status(200).json({
        message: "Update order status successfully", 
        data: toOrderDetail(order)
    })
})

const getOrderStatusLog = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const { page = 1, limit = 10 } = req.query

    const result = await getOrderStatusLogService(order_id, page, limit)

    res.status(200).json({
        message: "Get order status log successfully", 
        data: result.logs,
        meta: result.pagination
    })
})



module.exports = {
    createOrder,
    getOrder,
    getOrderById,
    updateOrder,
    updateAssignOrder,
    updateOrderStatus,
    getOrderStatusLog
}