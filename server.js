const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Store active rooms to validate codes (optional enhancement)
const activeRooms = new Set();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle joining a room
    socket.on('joinRoom', (roomCode) => {
        socket.join(roomCode);
        activeRooms.add(roomCode);
        io.to(roomCode).emit('message', `User ${socket.id} joined the chat`);
    });

    // Handle chat messages
    socket.on('chatMessage', (data) => {
        io.to(data.roomCode).emit('message', `${data.name}: ${data.message}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});