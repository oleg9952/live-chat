const chatRooms = []

// CREATE AND STORE A ROOM
module.exports.createRoom = (roomId, roomName) => {
    chatRooms.push({
        roomId,
        roomName
    })
}

// GET ROOMS
module.exports.getRooms = () => {
    return chatRooms
}