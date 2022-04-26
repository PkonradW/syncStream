const { time } = require('console');
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
let timeSinceSync = new Date();
let currentTime = new Date();
// create a variable to store the current video duration
var numUsers = 0;
var masterTime = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => { // create a new socket connection 
    console.log('a user connected ' + socket.id);
    io.emit('chat message', 'a user connected');


    socket.on('disconnect', () => { 
        currentTime = new Date();
        console.log('user disconnected ' + currentTime.toLocaleString());
        timeSinceSync = new Date();
    });
    socket.on('chat message', msg => { // listen for chat message
        io.emit('chat message', msg); // send message to all users
    });
    socket.on('video loaded', () => { // listen for video loaded 
        console.log('client loaded video'); // 
    });
    socket.on('video playing', time => {
        currentTime = new Date();
        console.log('client started video' + currentTime.toLocaleString());
        timeSinceSync = currentTime - timeSinceSync;
        io.emit('play', masterTime);
    });
    socket.on('video paused', time => {
        currentTime = new Date();
        console.log('client paused video at' + time);
        timeSinceSync = currentTime - timeSinceSync;
        console.log("time since sync: " + timeSinceSync.toLocaleString() + " milliseconds");
        if (timeSinceSync > 50) {
            console.log("pausing and syncing");
            masterTime = time;
            io.emit('pause video', masterTime);
        } else {
            console.log("not syncing video");
        }
        timeSinceSync = new Date();
        console.log("");
    });

});

// broadcast to all
http.listen(port, () => {
    console.log('listening on ' + port);
});
