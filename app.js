const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./router/socket')(io)
require('./db/connect')
const router = require('./router/routes')


app.set('view engine','ejs')
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));
app.use(router)



const port = process.env.PORT

server.listen(port,()=>{
    console.log(`server is started at port ${port}`)
})