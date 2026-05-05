const express = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { getNotification, getNotificationUnreadCount, updateNotificationRead, updateNotificationReadAll } = require("./notification.controller");

const router = express.Router();


router.get("/", authMiddleware, getNotification)
router.get("/unread-count", authMiddleware, getNotificationUnreadCount)
router.patch("/:id/read", authMiddleware, updateNotificationRead)
router.patch("/read-all", authMiddleware, updateNotificationReadAll)


module.exports = router
