const getPaymentStatus = (order) => {
  if (order.total_paid === 0) return "unpaid"
  if (order.total_paid < order.total_cost) return "partial"
  if (order.total_paid === order.total_cost) return "paid"
  return "overpaid"
}

module.exports = { getPaymentStatus }