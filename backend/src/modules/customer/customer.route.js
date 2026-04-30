const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {createCustomerSchema, updateCustomerSchema} = require('./customer.schema')
const {getCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer} = require('./customer.controller')
const { roleMiddleware } = require("../../middlewares/role.middleware");

const router = express.Router();


router.get("/", authMiddleware, roleMiddleware(["admin", "staff"]), getCustomer)
router.get("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), getCustomerById)
router.post("/", authMiddleware, roleMiddleware(["admin", "staff"]), validate(createCustomerSchema), createCustomer)
router.patch("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), validate(updateCustomerSchema), updateCustomer)
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), deleteCustomer)



module.exports = router

// advange
// GET /customers/:id/orders
// GET /customers/:id/stats
// GET /customers?keyword=abc   