const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Allow CORS

let waitingUsers = [];
var x = 0;

io.on("connection", (socket) => {
  console.log(`User ${socket.id}-${++x} connected`);

  if (waitingUsers.length > 0) {
    const partner = waitingUsers.pop();
    socket.emit("paired", partner); // Let the current user know who they are paired with
    io.to(partner).emit("paired", socket.id); // Let the partner know about the current user

    console.log(`${socket.id}-${x} connected with ${partner}-${x - 1}`);
  } else {
    socket.emit("waiting", "Waiting for a new partner");
    waitingUsers.push(socket.id);
    console.log(`Waiting for a partner`);
  }

  // Handle the message event to forward it to the partner
  socket.on("message", ({ message, partnerId }) => {
    console.log(`Message from ${socket.id} to ${partnerId}: ${message}`);
    io.to(partnerId).emit("message", { message, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id}-${x} Disconnected!`);
    waitingUsers = waitingUsers.filter((ids) => ids !== socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Track waiting users
// let waitingUsers = [];

// Handle connections
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Check if there is already a user waiting
//     if (waitingUsers.length > 0) {
//         const waitingUser = waitingUsers.pop();  // Remove the first waiting user
//         // Pair the current user with the waiting user
//         socket.emit('paired', waitingUser);
//         io.to(waitingUser).emit('paired', socket.id);
//         console.log(`Paired user ${socket.id} with user ${waitingUser}`);
//     } else {
//         // If no users are waiting, add this user to the waiting list
//         waitingUsers.push(socket.id);
//         socket.emit('waiting', 'Waiting for another user to connect...');
//         console.log(`User ${socket.id} is waiting for a partner`);
//     }

//     // Handle user disconnect
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//         // Remove the disconnected user from the waiting list if they were waiting
//         waitingUsers = waitingUsers.filter((userId) => userId !== socket.id);
//     });
// });
