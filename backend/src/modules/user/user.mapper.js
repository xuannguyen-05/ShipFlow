const baseUser = (user) => {
  if (!user) return null

  return {
    user_id: user.user_id,
    username: user.username,
    role: user.role
  }
}

const toUserSummary = (user) => {
  return baseUser(user)
}

const toUserDetail = (user) => {
  if (!user) return null

  return {
    ...baseUser(user),
    full_name: user.full_name,
    email: user.email
  }
}

module.exports = {
  toUserSummary,
  toUserDetail
}