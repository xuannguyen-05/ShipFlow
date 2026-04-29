const asyncHandler = require("../../utils/asyncHandler")
const {toUserSummary, toUserDetail} = require("./user.mapper")
const {getMeService, 
    updateMeService, 
    changePasswordService, 
    getUsersService,
    getUserByIdService,
    updateUserRoleService,
    deleteUserService} = require('./user.service')

const getMe = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id 

    const me = await getMeService(user_id)

    res.status(200).json({
        message: "Get me successfully", 
        data: toUserDetail(me)
    }) 
})

const updateMe = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id 

    const updatedMe = await updateMeService(user_id, req.body)

    res.status(200).json({
        message: "Updated me successfully", 
        data: toUserDetail(updatedMe)
    }) 
    
})

const changePassword = asyncHandler(async(req, res) => {

    const user_id = req.user.user_id 

    const {old_password, new_password} = req.body

    const result = await changePasswordService(user_id, old_password, new_password)

    res.status(200).json(result) 
})

const getUsers = asyncHandler(async(req, res) => {

    const { page = 1, limit = 10 } = req.query

    const result = await getUsersService(page, limit)

    res.status(200).json({
        message: "Get users successfully", 
        data: result.users.map(toUserSummary),
        meta: result.pagination
    })
})

const getUserById = asyncHandler(async(req, res) => {

    const user_id = +req.params.id

    const result = await getUserByIdService(user_id)

    res.status(200).json({
        message: "Get user detail successfully", 
        data: toUserDetail(result)
    })
})

const updateUserRole = asyncHandler(async(req, res) => {

    const admin_id = req.user.user_id 
    const userId = +req.params.id
    const {role} = req.body

    const result = await updateUserRoleService(admin_id, userId, role)

    res.status(200).json({
        message: "Update role successfully", 
        data: toUserSummary(result)
    })
})

const deleteUser = asyncHandler(async(req, res) => {

    const user_id = +req.params.id

    const result = await deleteUserService(user_id)

    res.status(200).json({
        message: "Delete user successfully", 
        data: result
    })
})


module.exports = {getMe, updateMe, changePassword, getUsers, getUserById, updateUserRole, deleteUser}