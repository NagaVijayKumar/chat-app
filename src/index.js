const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')   // send message to only particular user

    socket.broadcast.emit('message', 'A new user joined')  //Send message to all users except the curr user

    socket.on('sendMessage', (message) => {
        io.emit('message', message)      // Send messages to all users
    })

    //notify all users when a user leaves
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user left!')
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})