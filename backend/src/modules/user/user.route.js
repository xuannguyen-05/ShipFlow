const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = express.Router();






module.exports = router