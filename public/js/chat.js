const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (err)=>{

        if(err){
            return console.log(err)
        }

        console.log("Deliverd!")

    })
})

document.querySelector('#send-location').addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert("Your Browser not support to share Locatiion")
    }
    
    navigator.geolocation.getCurrentPosition((position)=>{
      
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })

    })
})