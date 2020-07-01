const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')
const port = process.env.PORT || 4500
const path = require('path')

const { createRoom, getRooms } = require('./utils/rooms')
const { joinUser, getCurrentUser, getUsers, leaveUser } = require('./utils/users')
const { addMessage, getMessages } = require('./utils/messages')

app.use(express.static(path.join(__dirname, '../client/build')))

io.on('connection', (socket) => {
    // send user his ID
    io.to(socket.id).emit('getMyId', socket.id)

    // WORK WITH ROOMS
    socket.on('getRooms', () => {
        io.emit('getRooms', getRooms())
    })
    socket.on('createRoom', (roomName) => {
        createRoom(uuidv4(), roomName)
        io.emit('getRooms', getRooms())
    })

    // JOIN ROOM
    socket.on('joinRoom', (userName, roomId) => {
        joinUser(socket.id, userName, roomId)
        socket.join(roomId)
    })
    
    // update the list of users in the current room and get messages for this room
    socket.on('usersInTheRoom', (roomId) => {
        // send the list of users in the room for everyone
        io.in(roomId).emit('usersInTheRoom', getUsers(roomId))
        // send mssg history to the one user who just connected to the room
        io.to(socket.id).emit('message', getMessages(roomId))
    })
    // send user the messaging history
    // handle messeging
    socket.on('message', (userName, roomId, mssg) => {
        addMessage(socket.id, userName, roomId, mssg)
        io.in(roomId).emit('message', getMessages(roomId))
    })
    // remove user on room leave or DISCONNECT
    socket.on('leaveRoom', () => {
        const user = leaveUser(socket.id)
        if (user) {
            io.in(user.roomId).emit('usersInTheRoom', getUsers(user.roomId))
            socket.leave(user.roomId)
        }
    })
    socket.on('disconnect', () => {
        const user = leaveUser(socket.id)
        if (user) {
            io.in(user.roomId).emit('usersInTheRoom', getUsers(user.roomId))
            socket.leave(user.roomId)
        }
    })
})

server.listen(port, () => console.log(`Running on port: ${port}`));