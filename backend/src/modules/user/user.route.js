const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { getMe, updateMe, changePassword, getUsers, getUserById, updateUserRole, deleteUser } = require("./user.controller");
const { updateUserSchema, changePasswordSchema, roleSchema } = require("./user.schema");
const { roleMiddleware } = require("../../middlewares/role.middleware");

const router = express.Router();

router.get("/me", authMiddleware, getMe)
router.patch("/me", authMiddleware, validate(updateUserSchema), updateMe)
router.patch("/change-password", authMiddleware, validate(changePasswordSchema), changePassword)

router.get("/", authMiddleware, roleMiddleware(["admin"]), getUsers)
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getUserById)
router.patch("/:id/role", authMiddleware, roleMiddleware(["admin"]), validate(roleSchema), updateUserRole)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser)



module.exports = router