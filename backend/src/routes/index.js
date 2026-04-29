const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.route.js");
const userRoutes = require("../modules/user/user.route");
const customerRoutes = require("../modules/customer/customer.route");



router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);


module.exports = router;