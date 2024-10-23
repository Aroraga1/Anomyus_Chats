// const { METHODS } = require('http');

// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server,{
//     cors:{
//         origin:'*',
//         METHODS:["GET","POST"],
//         allowedHeaders: ["my-custom-header"],
//         Credential:true
//     }
// });

// io.on("connection", (socket) => {
//     console.log('what this socket is:', socket);

//     socket.on("chat",(payload) => {
//         console.log("what is payload: ",payload);
        
//         io.emit("chat",payload);        
//     })    
// });

// server.listen(5000,()=>{console.log("server is Active now✨");});