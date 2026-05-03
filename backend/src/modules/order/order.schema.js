const { z } = require("zod")
const {OrderStatus, ServiceType} = require("@prisma/client")

const createOrderSchema = z.object({
  customer_id: z.number(),
  assigned_to: z.number().optional(),

  service_type: z.nativeEnum(ServiceType),
  origin: z.string().min(1),
  destination: z.string().min(1),

  etd: z.coerce.date().optional(),
  eta: z.coerce.date().optional(),

}).strict()

const updateOrderSchema = z.object({
  assigned_to: z.number().optional(),

  service_type: z.nativeEnum(ServiceType),
  origin: z.string().min(1),
  destination: z.string().min(1),

  etd: z.coerce.date().optional(),
  eta: z.coerce.date().optional(),
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
)

const updateAssignSchema = z.object({
  assigned_to: z.number().nullable()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
)

const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
})

module.exports = {
  createOrderSchema,
  updateOrderSchema,
  updateAssignSchema,
  updateOrderStatusSchema
}