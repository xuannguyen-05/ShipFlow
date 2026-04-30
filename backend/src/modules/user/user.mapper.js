const mapBaseUser = (user) => {
  if (!user) return null

  return {
    user_id: user.user_id,
    username: user.username,
    role: user.role
  }
}

const toUserSummary = (user) => {
  return mapBaseUser(user)
}

const toUserDetail = (user) => {
  const base = mapBaseUser(user)
  if (!base) return null

  return {
    ...base,
    full_name: user.full_name ?? null,
    email: user.email ?? null
  }
}

module.exports = {
  toUserSummary,
  toUserDetail
}