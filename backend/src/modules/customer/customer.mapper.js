const baseCustomer = (customer) => {
  if (!customer) return null

  return {
    customer_id: customer.customer_id,
    company_name: customer.company_name,
  }
}

const toCustomerSummary = (customer) => {
  return baseCustomer(customer)
}

const toCustomerDetail = (customer) => {
  const base = baseCustomer(customer)

  if (!base) return null

  return {
    ...base,
    contact_person: customer.contact_person ?? null,
    email: customer.email ?? null,
    phone: customer.phone ?? null
  }
}

module.exports = {
  toCustomerSummary,
  toCustomerDetail
}