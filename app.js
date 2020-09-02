const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./router/socket')(io)
require('./db/connect')
const authRouter = require('./router/routes')
const teacherRouter = require('./router/teacher')
const studentRouter = require('./router/student')


app.set('view engine','ejs')
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));
app.use(authRouter)
app.use(teacherRouter)
app.use(studentRouter   )



const port = process.env.PORT || 3000

server.listen(port,()=>{
    console.log(`server is started at port ${port}`)
})