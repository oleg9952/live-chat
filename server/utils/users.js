const users = []

// CREATE A USER
module.exports.joinUser = (userId, userName, roomId) => {
    users.push({
        userId,
        userName,
        roomId
    })
}

// GET CURRENT USER
module.exports.getCurrentUser = (userId) => {
    return users.find(user => user.userId === userId)
}

// GET USERS IN THE CURRENT ROOM
module.exports.getUsers = (roomId) => {
    return users.filter(user => user.roomId === roomId)
}

// REMOVE USER AND GET BACK THE USER THAT LEFT
module.exports.leaveUser = (userId) => {
    const index = users.findIndex(user => user.userId === userId)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}