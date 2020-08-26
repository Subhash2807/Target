const User = require('../db/user.js')

module.exports = (io) =>{
    io.on('connection',socket=>{
        console.log('new connection',socket.id)

        socket.on('join-room',(userId,roomId,name)=>{
            socket.join(roomId);
            console.log(name)
            socket.to(roomId).broadcast.emit('user-connected',userId,name)
        })
    })
}