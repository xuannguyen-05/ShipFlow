const jwt = require("jsonwebtoken")
const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const getCustomersService = async(page, limit) => {

    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            skip,
            take: safeLimit,
            where: {
                is_deleted: false
            },
            orderBy: {
                created_at: "desc"
            },
            select: {
                customer_id: true,
                company_name: true,
                contact_person: true,
                email: true,
                phone: true
            }
        }),

        prisma.customer.count({
            where: {
                is_deleted: false
            }
        })
    ])

    return {
        customers,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}

const getCustomerByIdService = async(customer_id) => {

    if (Number.isNaN(customer_id)) {
        throw new AppError("Invalid Customer ID", 400)
    }

    const customer = await prisma.customer.findFirst({
        where: {
            customer_id,
            is_deleted: false
        },
        select: {
            customer_id: true,
            company_name: true,
            contact_person: true,
            email: true,
            phone: true
        }
    })

    if(!customer){
        throw new AppError("Customer not found", 404)
    }

    return customer
}

const createCustomerService = async(data) => {
    if (data.email) {
        const existed = await prisma.customer.findFirst({
            where: {
                email: data.email
            }
        })

        if (existed) {
            throw new AppError("Email already exists", 409)
        }
    }

    const customer = await prisma.customer.create({
        data: {
            company_name: data.company_name,
            contact_person: data.contact_person,
            email: data.email,
            phone: data.phone
        }
    })

    return customer
}

const updateCustomerService = async (customer_id, data) => {

    if (Number.isNaN(customer_id)) {
        throw new AppError("Invalid Customer ID", 400)
    }

    const existingCustomer = await prisma.customer.findFirst({
        where: {
            customer_id,
            is_deleted: false
        }
    })

    if (!existingCustomer) {
        throw new AppError("Customer not found", 404)
    }

    if (data.email) {
        const existed = await prisma.customer.findFirst({
            where: {
                email: data.email,
                NOT: {
                    customer_id
                }
            }
        })

        if (existed) {
            throw new AppError("Email already exists", 409)
        }
    }

    const allowedFields = ["company_name", "contact_person", "email", "phone"]
    const updateData = {}

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field]
        }
    }

    const updatedCustomer = await prisma.customer.update({
        where: { customer_id },
        data: updateData,
        select: {
            customer_id: true,
            company_name: true,
            contact_person: true,
            email: true,
            phone: true
        }
    })

    return updatedCustomer
}

const deleteCustomerService = async(customer_id) => {

    if (Number.isNaN(customer_id)) {
        throw new AppError("Invalid Customer ID", 400)
    }

    const customer = await prisma.customer.findFirst({
        where: {
            customer_id,
            is_deleted: false
        }
    })

    if(!customer){
        throw new AppError("Customer not found", 404)
    }

    const deleted = await prisma.customer.update({
        where: {customer_id},
        data: {
            is_deleted: true,
            deleted_at: new Date()
        },
        select: {
            customer_id: true,
            is_deleted: true,
            deleted_at: true
        }
    })

    return deleted
}

module.exports = {getCustomersService, getCustomerByIdService, createCustomerService, updateCustomerService, deleteCustomerService}

