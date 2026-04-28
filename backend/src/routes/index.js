const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.route.js");
// const userRoutes = require("../modules/user/user.route");
// const orderRoutes = require("../modules/order/order.route");
// const paymentRoutes = require("../modules/payment/payment.route");


router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/orders", orderRoutes);
// router.use("/payments", paymentRoutes);

module.exports = router;