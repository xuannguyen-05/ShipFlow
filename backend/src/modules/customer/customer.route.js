const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");


const router = express.Router();


router.get("/", authMiddleware, getCustomer)
router.get("/:id", authMiddleware, getCustomerById)
router.post("/", authMiddleware, createCustomer)
router.patch(":id", authMiddleware, )
router.delete("/:id", authMiddleware, )



module.exports = router

// advange
// GET /customers/:id/orders
// GET /customers/:id/stats
// GET /customers?keyword=abc   