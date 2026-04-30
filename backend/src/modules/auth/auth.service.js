const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const prisma = require("../../config/prisma")
const AppError = require("../../utils/AppError")

const registerService  = async(data) => {
    const {username, password} = data
    const normalizedUsername = username.trim().toLowerCase()
    
    const existingUser = await prisma.user.findUnique({
        where: {username: normalizedUsername}
    })
    if (existingUser){
        throw new AppError("User name already exists", 409)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            username,
            password_hash: hashedPassword
        },
        select: {
            user_id : true,
            username: true
        }
    })

    return user
}

const loginService = async(data) => {
    const {username, password} = data
    const normalizedUsername = username.trim().toLowerCase()

    const user = await prisma.user.findUnique({
        where: {username: normalizedUsername}
    })

    if (!user) {
        throw new AppError("Invalid username or password", 400)
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
        throw new AppError("Invalid username or password", 400)
    }

    const accessToken = jwt.sign(
        { 
            user_id: user.user_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    const refreshToken = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    )

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            user_id: user.user_id,
            expires_at: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000 
            )
        }
    });

    return {
        user_id: user.user_id,
        username: user.username,
        accessToken,
        refreshToken
    }
}

const refreshTokenService = async (token) => {
    if (!token) {
        throw new AppError("No refresh token", 401)
    }

    let payload
    try {
        payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
        throw new AppError("Invalid refresh token", 401)
    }

    const storedToken = await prisma.refreshToken.findUnique({
        where: { token }
    })

    if (!storedToken) {
        throw new AppError("Refresh token not found", 401)
    }

    if (storedToken.revoked) {
        throw new AppError("Refresh token revoked", 401)
    }

    if (storedToken.expires_at < new Date()) {
        throw new AppError("Refresh token expired", 401)
    }

    const user = await prisma.user.findUnique({
        where: { user_id: payload.user_id }
    })

    if (!user) {
        throw new AppError("User not found", 404)
    }

    const newAccessToken = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return {
        accessToken: newAccessToken
    }
}

const logoutService = async (token) => {
    await prisma.refreshToken.update({
        where: {
            token: token
        },
        data: {
            revoked: true
        }
    });

    return { message: "Logged out successfully" };
};

module.exports = {registerService, loginService, refreshTokenService, logoutService}