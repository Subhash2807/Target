$('#side').on('click',function(){
    $('.side_bar').toggle();
})

$('document').ready(()=>{
    console.log('ready')
    $('.head_messages').hide()
})

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

const msgTemp = document.querySelector('#msg_temp_text').innerHTML
const messages = document.querySelector('.head_messages');

const send = document.querySelector('#msg')
send.onclick = ()=>{
    const html  = Mustache.render(msgTemp,{
        username:'rustam',
        createdAt:"21:30 am",
        message:"hi developer!!!"
    })

    messages.insertAdjacentHTML('beforeend',html);
    $('.head_messages').scrollTop($('.head_messages').height())

}

