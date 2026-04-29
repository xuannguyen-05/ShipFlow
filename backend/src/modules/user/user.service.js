const jwt = require("jsonwebtoken")
const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")
const bcrypt = require("bcrypt")

const getMeService = async(user_id) => {
    const user = await prisma.user.findUnique({
        where: {user_id},
        select: {
            user_id: true,
            username: true,
            full_name: true,
            email: true,
            role: true,
            created_at: true,
            is_deleted: true
        }
    })

    if(!user || user.is_deleted) {
        throw new AppError("User not valid", 401)
    }

    return user
}

const updateMeService = async(user_id, data) => {
    const allowedFields = ["full_name", "email"]
    const updateData = {}

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field]
        }
    }

    const existingMe = await prisma.user.findUnique({
        where: { user_id }
    })

    if (!existingMe || existingMe.is_deleted) {
        throw new AppError("User not found", 404)
    }

    const updateMe = await prisma.user.update({
        where: {user_id},
        data: updateData,
        select: {
            user_id: true,
            username: true,
            full_name: true,
            email: true,
            role: true
        }
    })

    return updateMe
}

const changePasswordService = async(user_id, old_password, new_password) => {
    const user = await prisma.user.findUnique({
        where: { user_id }
    })

    if (!user || user.is_deleted) {
        throw new AppError("User not found", 404)
    }

    const isMatch = await bcrypt.compare(old_password, user.password_hash)

    if (!isMatch) {
        throw new AppError("Old password is incorrect", 400)
    } 

    const newHash = await bcrypt.hash(new_password, 10)

    await prisma.user.update({
        where: {user_id},
        data: {
            password_hash: newHash
        }
    })

    return {
        message: "Password changed successfully"
    }
}

const getUsersService = async(page, limit) => {

    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: safeLimit,
            where: {
                is_deleted: false
            },
            orderBy: {
                created_at: "desc"
            },
            select: {
                user_id: true,
                username: true,
                full_name: true,
                email: true,
                role: true
            }
        }),

        prisma.user.count({
            where: {
                is_deleted: false
            }
        })
    ])

    return {
        users,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit)
        }
    }
}

const getUserByIdService = async(user_id) => {

    if (Number.isNaN(user_id)) {
        return res.status(400).json({
            message: "Invalid User ID"
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            user_id,
            is_deleted: false
        },
        select: {
            user_id: true,
            username: true,
            full_name: true,
            email: true,
            role: true
        }
    })

    if(!user){
        throw new AppError("User not found", 404)
    }

    return user
}

const updateUserRoleService = async(admin_id, userId, role) => {

    if (Number.isNaN(userId)) {
        return res.status(400).json({
            message: "Invalid User ID"
        })
    }

    if (admin_id === userId) {
        throw new AppError("You cannot change your own role", 400)
    }

    const user = await prisma.user.findFirst({
        where: {
            user_id: userId,
            is_deleted: false
        }
    })

    if(!user){
        throw new AppError("User not found", 404)
    }

    const updated = await prisma.user.update({
        where: {user_id: userId},
        data: {
            role
        },
        select: {
            user_id: true,
            username: true,
            role: true
        }
    })

    return updated
}

const deleteUserService = async(user_id) => {

    if (Number.isNaN(user_id)) {
        return res.status(400).json({
            message: "Invalid User ID"
        })
    }

    const user = await prisma.user.findUnique({
        where: {user_id}
    })

    if(!user || user.is_deleted){
        throw new AppError("User not found", 404)
    }

    const deleted = await prisma.user.update({
        where: {user_id},
        data: {
            is_deleted: true,
            deleted_at: new Date()
        },
        select: {
            user_id: true,
            is_deleted: true,
            deleted_at: true
        }
    })

    return deleted
}
module.exports = {getMeService, 
    updateMeService, 
    changePasswordService, 
    getUsersService, 
    getUserByIdService, 
    updateUserRoleService,
    deleteUserService}