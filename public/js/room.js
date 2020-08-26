$('document').ready(()=>{


// Animation

$('#side').on('click',function(){
    $('.side_bar').toggle();
})

    console.log('ready')
    $('.head_messages').hide()

$('.left').on('click',()=>{
    $('.left').css('background-color','#C0C0C0')
    $('.right').css('background-color','#FAFAFA')
    // $('.head_contacts').css('height','90vh')
    // $('.head_messages').css('height','0')
    // $('.head_contacts').fadeIn()
    // $('.head_messages').fadeOut();
    $('.head_contacts').show()
    $('.head_messages').hide()
})

$('.right').on('click',()=>{
    $('.right').css('background-color','#C0C0C0')
    $('.left').css('background-color','#FAFAFA')
    // $('.head_contacts').css('height','0')
    // $('.head_messages').css('height','90vh')
    // $('.head_contacts').fadeOut()
    // $('.head_messages').fadeIn()
    $('.head_contacts').hide()
    $('.head_messages').show()
})



// templates insertion contact


const contTemp = document.querySelector('#cont_temp').innerHTML

const contacts = document.querySelector('.head_contacts')
const test = document.querySelector('.test')

test.onclick = ()=>{
    console.log('clicked')
    const html = Mustache.render(contTemp,{
        username:'Rustam'
    })
    contacts.insertAdjacentHTML('beforeend',html)
}


// template insertion message



// PeerJs ----------------


    const socket = io();
    const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
    
    const peers={};
    const calls={};
    const msg ={};
    const names ={}
    var id;

    const video = document.querySelector('#main_video')
    var UserStream;

    navigator.mediaDevices.getUserMedia({video:true,audio:{echoCancellation: true}}).then(stream=>{
        UserStream=stream
        video.srcObject = UserStream;
    })

    
    // bottom icon bar 

    const mic = document.querySelector('.mic')
    const cam = document.querySelector('.camera')
    const disconnect = document.querySelector('.disconnect')

    mic.onclick = ()=>{
        UserStream.getAudioTracks()[0].enabled = !(UserStream.getAudioTracks()[0].enabled);
        // video.srcObject = UserStream
    }
    cam.onclick=()=>{
        UserStream.getVideoTracks()[0].enabled = !(UserStream.getVideoTracks()[0].enabled);
    }
    disconnect.onclick = ()=>{
        if(confirm('close window'))
        {
            window.open('/home','_self');
            window.close()
        }
    }

    myPeer.on('open',id=>{
        socket.emit('join-room',id,roomId,myName)
    })

    socket.on('user-connected',(userId,name)=>{
        names[userId]=name;
        connectToMsg(userId,myName)
        // connectToNewUser(userId)
        console.log('1',userId,name)

    })

    const connectToMsg = (userId,name)=>{
        const conn = myPeer.connect(userId)
        conn.on('open',()=>{
            console.log(2,name,conn)
            conn.send({
                type:'meta',
                name:name,
            })
            conn.send({
                type:'pdf',
                file:'hello file'
            })
            conn.send({
                type:'png',
                file:'hello'
            })
        })
        msg[userId]=conn;
    }

    myPeer.on('connection',(conn)=>{

        if(msg[conn.peer]==null)
        connectToMsg(conn.peer,myName)
        console.log(3,'connection established')

        conn.on('data',(data)=>{
            console.log(data)
            switch(data.type){
                case 'meta':console.log(data.name);
                            names[conn.peer]=data.name;
                            break;
                case 'msg':console.log(data.msg);
                            sendMsg(names[conn.peer],data.msg)
                            break;
                case 'image':sendImg(names[conn.peer],data.fileType,data.file,data.fileName);
                            break;
                    default:sendFile(names[conn.peer],data.fileType,data.file,data.fileName);
                    break;
            }
        })
    })

    // sending text msg

    const textMsg = document.querySelector('.text');
    const msgTemp = document.querySelector('#msg_temp_text').innerHTML
    const imgTemp = document.querySelector('#msg_temp_img').innerHTML
    const fileTemp = document.querySelector('#msg_temp_file').innerHTML

    const messages = document.querySelector('.head_messages');

    const send = document.querySelector('#msg')

    send.onclick = ()=>{

        sendMsg(myName,textMsg.value);
        for(let key in msg)
        {
            if(msg.hasOwnProperty(key)){
            value=msg[key];
            value.send({
                type:'msg',
                msg:textMsg.value
            })
            }
        }
        textMsg.value='';
    }


    const sendMsg = (name,message)=>{
    const html  = Mustache.render(msgTemp,{
        username:name,
        createdAt:moment().format('h:mm a'),
        message:message
    })

    messages.insertAdjacentHTML('beforeend',html);
    $('.head_messages').scrollTop($('.head_messages').height())

    }

    const sendImg = (name,type,file,fileName)=>{
        const bytes = new Uint8Array(file);
        const blob = new Blob([bytes],{type:type})
        const url = URL.createObjectURL(blob)
        const html = Mustache.render(imgTemp,{
            username:name,
            createdAt:moment().format('h:mm a'),
            src:url
        })

        messages.insertAdjacentHTML('beforeend',html)
        $('.head_messages').scrollTop($('.head_messages').height())

    }

    const sendFile = (name,type,file,fileName)=>{
        const bytes = new Uint8Array(file);
        const blob = new Blob([bytes],{type:type})
        const url = URL.createObjectURL(blob)
        const html = Mustache.render(fileTemp,{
            username:name,
            createdAt:moment().format('h:mm a'),
            href:url,
            fileName:fileName,
            downloadName:fileName
        })
        messages.insertAdjacentHTML('beforeend',html)
        $('.head_messages').scrollTop($('.head_messages').height())

    }

const fileSend = document.querySelector('#file-upload')
fileSend.onchange = ()=>{
    // console.log('selected')
    const file = fileSend.files[0]
    if(file.type.includes('image'))
    {
        for(let key in msg)
        {
            if(msg.hasOwnProperty(key)){
            value=msg[key];
            value.send({
                type:'image',
                fileType:file.type,
                file:file,
                fileName:file.name
            })
            }
        }
    }
    else
    {
        for(let key in msg)
        {
            if(msg.hasOwnProperty(key)){
            value=msg[key];
            value.send({
                type:"file",
                fileType:file.type,
                file:file,
                fileName:file.name,
            })
            }
        }
    }
}

})
