const express = require('express');
const path = require('path');

const app = require('express')();
const http = require('http').Server(app);
// new instance of socket.io initialized by passing
// the 'server' object. Then you listen on the connection event
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const users = {};
// create a timestamp variable
let timestamp = new Date().toLocaleTimeString();
// create a variable to store the current video duration
var numUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => { // create a new socket connection
    timestamp 
    console.log('a user connected' + socket.id);
        if (numUsers <=8) { // only allow 8 users to connect
            socket.join('room1');
        }
    socket.on('disconnect', () => { 
        console.log('user disconnected');
    });
    socket.on('chat message', msg => { // listen for chat message
        io.emit('chat message', msg); // send message to all users
    });
    socket.on('video loaded', () => { // listen for video loaded 
        console.log('client loaded video'); // 
    });
    socket.on('video playing', () => {
        console.log('client playing video');
        io.emit('play video');
    });
    socket.on('video paused', time => {
        console.log('client paused video');
        io.emit('pause video', time);
    });

});

// broadcast to all
http.listen(port, () => {
    console.log('listening on ' + port);
});
