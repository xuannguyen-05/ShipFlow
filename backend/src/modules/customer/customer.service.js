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