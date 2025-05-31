const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update this if your React app runs on a different port
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (username) => {
    socket.username = username;
    io.emit('chat message', { 
      user: 'System', 
      message: `${username} has joined the chat` 
    });
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', { 
      user: socket.username, 
      message: data.message 
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('chat message', { 
        user: 'System', 
        message: `${socket.username} has left the chat` 
      });
    }
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});