const { z } = require("zod")
const { PaymentMethod } = require("@prisma/client")

const addPaymentSchema = z.object({
    type: z.nativeEnum(PaymentMethod),
    amount: z.coerce.number().positive(),
    
})

module.exports = { addPaymentSchema }