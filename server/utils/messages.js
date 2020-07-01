const messages = []

// SAVE MESSAGE
module.exports.addMessage = (userId, userName, roomId, mssg) => {
    const newMssg = {
        userId,
        userName,
        roomId,
        mssg
    }
    
    messages.push(newMssg)

    return newMssg
}

// GET MSSGS OF CURRENT ROOM
module.exports.getMessages = (roomId) => {
    return messages.filter(mssg => mssg.roomId === roomId)
}