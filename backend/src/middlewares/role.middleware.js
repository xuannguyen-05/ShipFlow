const prisma = require("../config/prisma")

const roleMiddleware = (roles) => {
  return async (req, res, next) => {

    const userRoles = await prisma.user_roles.findMany({
      where: { userID: req.user.userID },
      include: { roles: true }
    })

    const roleNames = userRoles.map(r => r.roles.roleName)

    const hasRole = roles.some(role => roleNames.includes(role))

    if (!hasRole) {
      return res.status(403).json({
        message: "Forbidden"
      })
    }

    next()
  }
}

module.exports = { roleMiddleware }