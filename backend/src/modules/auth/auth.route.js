const express = require("express");
const { register, login, refreshToken, logout } = require("./auth.controller");
const { validate } = require("../../middlewares/validate.middleware");
const authBaseSchema = require("./auth.schema");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = express.Router();


router.post("/register", validate(authBaseSchema), register)
router.post("/login", validate(authBaseSchema), login)
router.post("/refresh-token", refreshToken)
router.post("/logout", authMiddleware, logout)


module.exports = router