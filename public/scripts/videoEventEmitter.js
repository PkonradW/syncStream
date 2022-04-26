

var video = document.getElementById('video');

video.addEventListener('loadeddata', function(e) {
    if (video.readyState === 4) {
        socket.emit('video loaded');
    }
});
video.addEventListener('play', function(time) {
    socket.emit('video playing', video.currentTime);
});

// create an event listener for pausing the video
video.addEventListener('pause', function(e) {
    socket.emit('video paused', video.currentTime);
});

socket.on('pause video', function(time) {
    video.pause();
    video.currentTime = time;
});
socket.on('play', function(time) {
    // if video is loaded, play it
    //video.fastSeek(time);
    video.play();
});