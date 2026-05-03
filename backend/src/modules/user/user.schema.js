const { Role } = require("@prisma/client")
const { z } = require("zod")

const updateUserSchema = z.object({
  full_name: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
)

const changePasswordSchema = z.object({
    old_password: z.string().min(8),
    new_password: z.string().min(8, "Password must be at least 8 characters")
})
.strict()
.refine(
  (data) => data.old_password !== data.new_password,
  {
    message: "New password must be different from old password"
  }
)

const roleSchema = z.object({
  role: z.nativeEnum(Role)
})

module.exports = {updateUserSchema, changePasswordSchema, roleSchema}