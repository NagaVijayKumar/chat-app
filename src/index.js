const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)){
           return callback("profintiy is not allowed!") 
        }

        io.emit('message', message)      // Send messages to all users
        callback()
    })

    //notify all users when a user leaves
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user left!')
    })

    socket.on('sendLocation',(coords, callback )=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})