const express = require("express");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { roleMiddleware } = require("../../middlewares/role.middleware");
const {updateDocument, deleteDocument} = require("./document.controller");
const { updateDocumentSchema } = require("./document.schema");

const router = express.Router();

router.patch("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), validate(updateDocumentSchema), updateDocument)
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "staff"]), deleteDocument)


module.exports = router
