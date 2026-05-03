const { z } = require("zod")
const { CostType } = require("@prisma/client")


const addCostSchema = z.object({
    type: z.nativeEnum(CostType),
    amount: z.coerce.number().positive()
})

module.exports = { addCostSchema }
