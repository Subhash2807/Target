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



const contacts = document.querySelector('.head_contacts')

// PeerJs ----------------


    const socket = io();
    const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
    
    const peers={};
    const calls={};
    const msg ={};
    const names ={}
    const list ={};
    var Myid;

    const Video = document.querySelector('#main_video')
    var UserStream;

    navigator.mediaDevices.getUserMedia({video:true,audio:{echoCancellation: true}}).then(stream=>{
        UserStream=stream
        Video.srcObject = UserStream;
        console.log(Video)


        myPeer.on('call',call=>{
            
            call.answer(UserStream);
            const contTemp = document.querySelector('#cont_temp').innerHTML
            call.on('stream',userVideoStream=>{
                addVideoStream(contTemp,userVideoStream,names[call.peer],call.peer)
                console.log(call.peer)
            })
            
            
        })

      
    })
    socket.on('user-connected',(userId,name)=>{
        names[userId]=name;
        connectToMsg(userId,myName)
        connectToNewUser(userId,UserStream);
    })

    socket.on('user-disconnected',userId=>{
        console.log('disconnected 2')
        if(peers[userId]) peers[userId].close();
        if(msg[userId]) msg[userId].close();
        list[userId]=null;
        $('#'+userId).parents('.contact_temp').remove()
    })

    //Main Video psuedo code

    


    const connectToNewUser = (userId,UserStream)=>{
        const call = myPeer.call(userId,UserStream)
        const contTemp = document.querySelector('#cont_temp').innerHTML
        call.on('stream',userVideoStream=>{
            addVideoStream(contTemp,userVideoStream,names[userId],userId)
        })
        call.on('close',()=>{
            console.log('cloase')
            $('#'+userId).parents('.contact_temp').remove()
        })

        peers[userId]=call;
    }

    const addVideoStream = async (temp,stream,name,uid)=>{
        
        if(name && stream!=undefined && list[uid]!=1){
        const html = Mustache.render(temp,{
            username:name,
            videoId:uid
            
        })
       console.log("name",name)

        contacts.insertAdjacentHTML('beforeend',html)   
        try {document.querySelector('#'+uid).srcObject= stream}
        catch(e)
        {

        }
        document.querySelector('#'+uid).play()
        list[uid]=1;
    }
        
    }




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
        Myid=id;
        socket.emit('join-room',id,roomId,myName)
    })

    

    const connectToMsg = (userId,name)=>{
        const conn = myPeer.connect(userId)
        conn.on('open',()=>{
            console.log(2,name,conn)
            conn.send({
                type:'meta',
                name:name
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
                case 'meta':console.log(data.name,conn.peer);
                            names[conn.peer]=data.name;
                            sendResponse(conn.peer);
                            break;
                case 'response':console.log('got response');
                                connectToNewUser(conn.peer,UserStream);break;
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
    const sendResponse = (userId)=>{
        msg[userId].send({
            type:'response'
        })
    }

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

    socket.on('presenting',userId=>{
        peers[userId].close();
        list[userId]=null;
    })


    $('#present').on('click',async ()=>{
        let captureStream = null;
        try{
            captureStream = await navigator.mediaDevices.getDisplayMedia();
        }
        catch(e)
        {
            console.log('error',e);
        }
        UserStream.removeTrack(UserStream.getVideoTracks()[0])
        UserStream.addTrack(captureStream.getVideoTracks()[0])

        socket.emit('present',Myid);
        for(let key in msg)
        {
            if(msg.hasOwnProperty(key)){
            value=msg[key];
            peers[value.peer].close();
            connectToNewUser(value.peer,UserStream);
            }
        }
    })

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
