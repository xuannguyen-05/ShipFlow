const { z } = require("zod")

const authBaseSchema  = z.object({
    username: z.string().trim().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
}).strict();



module.exports = authBaseSchema

