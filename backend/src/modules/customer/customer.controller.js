const {getCustomersService, 
    getCustomerByIdService, 
    createCustomerService, 
    updateCustomerService, 
    deleteCustomerService} = require('./customer.service')

const asyncHandler = require("../../utils/asyncHandler")
const {toCustomerSummary, toCustomerDetail} = require('./customer.mapper')

const getCustomer = asyncHandler(async(req, res) => {

    const { page = 1, limit = 10 } = req.query

    const result = await getCustomersService(page, limit)

    res.status(200).json({
        message: "Get customers successfully", 
        data: result.customers.map(toCustomerSummary),
        meta: result.pagination
    })
})


const getCustomerById = asyncHandler(async(req, res) => {

    const customer_id = +req.params.id

    const customer = await getCustomerByIdService(customer_id)

    res.status(200).json({
        message: "Get customer detail successfully", 
        data: toCustomerDetail(customer)
    })
})

const createCustomer = asyncHandler(async(req, res) => {

    const customer = await createCustomerService(req.body)

    res.status(201).json({
        message: "Create customer successfully", 
        data: toCustomerDetail(customer)
    })
})

const updateCustomer = asyncHandler(async(req, res) => {

    const customer_id = +req.params.id

    const customer = await updateCustomerService(customer_id, req.body)

    res.status(200).json({
        message: "Update customer successfully", 
        data: toCustomerDetail(customer)
    })
})

const deleteCustomer = asyncHandler(async(req, res) => {

    const customer_id = +req.params.id

    const customer = await deleteCustomerService(customer_id)

    res.status(200).json({
        message: "Delete customer successfully", 
        data: customer
    })
})

module.exports={getCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer}
