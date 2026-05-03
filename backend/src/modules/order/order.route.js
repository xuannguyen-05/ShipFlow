const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { roleMiddleware } = require("../../middlewares/role.middleware");
const {
    createOrder,
    getOrder,
    getOrderById,
    updateOrder,
    updateAssignOrder,
    updateOrderStatus,
    getOrderStatusLog
} = require('./order.controller')
const {addCost, getCost} = require("../cost/cost.controller")
const {addPayment, getPayment} = require("../payment/payment.controller")
const {
    createOrderSchema,
    updateOrderSchema,
    updateAssignSchema,
    updateOrderStatusSchema
} = require('./order.schema');
const { addCostSchema } = require("../cost/cost.schema");
const { addPaymentSchema } = require("../payment/payment.schema");
const upload = require("../../middlewares/upload.middleware");
const { createDocument, getDocument } = require("../document/document.controller");
const { addDocumentSchema } = require("../document/document.schema");

const router = express.Router();


router.post("/", authMiddleware, roleMiddleware(["admin", "staff"]), validate(createOrderSchema), createOrder)
router.get("/", authMiddleware, getOrder)
router.get("/:id", authMiddleware, getOrderById)
router.patch("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), validate(updateOrderSchema), updateOrder)
router.patch("/:id/assign", authMiddleware, roleMiddleware(["admin", "staff"]), validate(updateAssignSchema), updateAssignOrder)
router.patch("/:id/status", authMiddleware, validate(updateOrderStatusSchema), updateOrderStatus)

// cost
router.post("/:id/costs", authMiddleware, roleMiddleware(["admin", "staff"]), validate(addCostSchema), addCost)
router.get("/:id/costs", authMiddleware, roleMiddleware(["admin", "staff"]), getCost)

// payment
router.post("/:id/payments", authMiddleware, roleMiddleware(["admin", "staff"]), validate(addPaymentSchema), addPayment)
router.get("/:id/payments", authMiddleware, roleMiddleware(["admin", "staff"]), getPayment)

// document 
router.post(
    "/:id/documents", 
    authMiddleware, 
    roleMiddleware(["admin", "staff"]), 
    upload.single("file"), 
    validate(addDocumentSchema), 
    createDocument
)
router.get("/:id/documents", authMiddleware, roleMiddleware(["admin", "staff"]), getDocument)

//orderStatusLog
router.get("/:id/history", authMiddleware, roleMiddleware(["admin", "staff"]), getOrderStatusLog)

    

module.exports = router