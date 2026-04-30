const { z } = require("zod")

const createCustomerSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  contact_person: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  phone: z.string().trim().min(5).optional()
}).strict()

const updateCustomerSchema = z.object({
  company_name: z.string().trim().min(1).optional(),
  contact_person: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  phone: z.string().trim().min(5).optional()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
)



module.exports = {createCustomerSchema, updateCustomerSchema}