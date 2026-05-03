const asyncHandler = require('../../utils/asyncHandler')
const {addPaymentService, getPaymentService} = require('./payment.service')

const addPayment = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const payment  = await addPaymentService(order_id, req.body)

    res.status(200).json({
        message: "Create payment successfully", 
        data: payment
    })
})

const getPayment = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const payments  = await getPaymentService(order_id)

    res.status(200).json({
        message: "Get payments successfully", 
        data: payments
    })
})

module.exports = {addPayment, getPayment}
