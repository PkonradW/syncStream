const { time } = require('console');
const express = require('express');
const path = require('path');

const app = require('express')();
const http = require('http').Server(app);
// new instance of socket.io initialized by passing
// the 'server' object. Then you listen on the connection event
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var users = [];
// create a timestamp variable
let timeSinceSync = new Date();
let currentTime = new Date();
var elapsedTime;
var lastKnownSeek = 0; // in seconds, relates to video.currentTime
// create a variable to store the current video duration
var numUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => { // create a new socket connection 
    console.log('a user connected ' + socket.id);
    io.emit('chat message', 'a user connected');
    numUsers++;

    socket.on('disconnect', () => { 
        console.log('user disconnected ' + currentTime.toLocaleString());
    });
    socket.on('chat message', msg => { // listen for chat message
        io.emit('chat message', msg); // send message to all users
    });
    socket.on('video loaded', () => { // listen for video loaded 
        console.log('client loaded video'); // 
    });
    socket.on('video playing', time => {
        lastKnownSeek = time;
        currentTime = new Date();
        console.log('client started video' + currentTime.toLocaleString());
        io.emit('play');
        timeSinceSync = new Date();
    });
    socket.on('video paused', time => {
        currentTime = new Date();
        console.log('client paused video at ' + time);
        elapsedTime = currentTime - timeSinceSync;
        console.log("time since sync: " + elapsedTime + " milliseconds");
        if (elapsedTime > 50) {
            console.log("pause/sync initiated by " + socket.id); 
            lastKnownSeek = time;
            io.emit('pause video', lastKnownSeek);
        } else {
            console.log("not syncing video");
        }
        timeSinceSync = new Date();
        console.log("");
    });
    socket.on('sync', () => {
        currentTime = new Date();
        elapsedTime = currentTime - timeSinceSync;
        elapsedTime = elapsedTime / 1000;
        console.log("last known seek: " + lastKnownSeek);
        lastKnownSeek += elapsedTime;
        io.to(socket.id).emit('sync', lastKnownSeek);
        console.log("elapsedTime: " + elapsedTime);
    });
    
}); // end of server

// broadcast to all
http.listen(port, () => {
    console.log('listening on ' + port);
});
