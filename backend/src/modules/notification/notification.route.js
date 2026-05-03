const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { roleMiddleware } = require("../../middlewares/role.middleware");


const router = express.Router();




module.exports = router
