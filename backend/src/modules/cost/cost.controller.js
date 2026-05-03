const asyncHandler = require('../../utils/asyncHandler')
const {addCostService, getCostService} = require('./cost.service')

const addCost = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const cost  = await addCostService(order_id, req.body)

    res.status(200).json({
        message: "Create cost successfully", 
        data: cost
    })
})

const getCost = asyncHandler(async(req, res) => {

    const order_id = +req.params.id

    const costs  = await getCostService(order_id)

    res.status(200).json({
        message: "Get costs successfully", 
        data: costs
    })
})

module.exports = {addCost, getCost}
