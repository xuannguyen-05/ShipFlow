const asyncHandler = require("../../utils/asyncHandler")
const {registerService, loginService, refreshTokenService, logoutService} = require("./auth.service")


const register = asyncHandler(async(req, res) => {

    const user = await registerService(req.body)

    res.status(201).json({
        message: "Register success", 
        data: user
    }) 
})

const login = asyncHandler(async(req, res) => {

    const user = await loginService(req.body)

    res.status(200).json({
        message: "Login success", 
        data: user
    })

})

const refreshToken = asyncHandler(async(req, res) => {

    const {refreshToken} = req.body

    const result = await refreshTokenService(refreshToken)

    res.status(200).json({
        accessToken: result.accessToken
    })
})

const logout = asyncHandler(async(req, res) => {

    const {refreshToken} = req.body

    const result = await logoutService(refreshToken)

    res.status(200).json(result)
})

module.exports = {register, login, refreshToken, logout}