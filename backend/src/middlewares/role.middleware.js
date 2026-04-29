const prisma = require("../config/prisma")

const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id }
      })

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }

      const hasRole = roles.includes(user.role)

      if (!hasRole) {
        return res.status(403).json({
          message: "Forbidden"
        })
      }

      next()

    } catch (err) {
      return res.status(500).json({
        message: err.message
      })
    }
  }
}

module.exports = { roleMiddleware }