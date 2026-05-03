const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.route.js");
const userRoutes = require("../modules/user/user.route");
const customerRoutes = require("../modules/customer/customer.route");
const orderRoutes = require("../modules/order/order.route");
const documentRoutes = require("../modules/document/document.route");
const notificationRoutes = require("../modules/notification/notification.route");



router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);


module.exports = router;