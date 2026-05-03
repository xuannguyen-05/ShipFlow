const { z } = require("zod")

const addDocumentSchema = z.object({
    doc_name: z.string().trim().min(1),
    deadline: z.string().datetime().nullable().optional()
}).strict()

const updateDocumentSchema = z.object({
    doc_name: z.string().trim().min(1).optional(),
    deadline: z.string().datetime().nullable().optional()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
)

module.exports = { addDocumentSchema, updateDocumentSchema }