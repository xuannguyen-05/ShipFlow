const { getIO, getOnlineUsers } = require("../config/socket")

const emitNotification = (user_id, data) => {
    const io = getIO()
    const onlineUsers = getOnlineUsers()

    const socketId = onlineUsers.get(user_id)

    if (socketId) {
        io.to(socketId).emit("notification:new", data)
    }
}

module.exports = { emitNotification }