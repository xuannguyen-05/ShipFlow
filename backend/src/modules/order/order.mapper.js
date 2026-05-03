const { getPaymentStatus } = require("./order.utils")

const mapBaseOrder = (order) => {
  if (!order) return null

  return {
    order_id: order.order_id,
    order_code: order.order_code,
    status: order.status,

    service_type: order.service_type,
    origin: order.origin,
    destination: order.destination,

    etd: order.etd,
    eta: order.eta,

    total_cost: order.total_cost,
    total_paid: order.total_paid,

    payment_status: getPaymentStatus(order),

    created_at: order.created_at,
    updated_at: order.updated_at
  }
}

const toOrderSummary = (order) => {
  const base = mapBaseOrder(order)
  if (!base) return null

  return {
    ...base,

    customer: order.customer
      ? {
          customer_id: order.customer.customer_id,
          company_name: order.customer.company_name
        }
      : null,

    creator: order.creator
      ? {
          user_id: order.creator.user_id,
          username: order.creator.username
        }
      : null,

    assignee: order.assignee
      ? {
          user_id: order.assignee.user_id,
          username: order.assignee.username
        }
      : null
  }
}

const toOrderDetail = (order) => {
  const base = mapBaseOrder(order)
  if (!base) return null

  const remaining = Number(order.total_cost) - Number(order.total_paid)

  return {
    ...base,

    remaining,

    customer: order.customer || null,

    creator: order.creator || null,
    assignee: order.assignee || null,

    status_logs: order.status_logs || [],
    documents: order.documents || [],
    costs: order.costs || [],
    payments: order.payments || []
  }
}


module.exports = { 
  toOrderSummary,
  toOrderDetail
}