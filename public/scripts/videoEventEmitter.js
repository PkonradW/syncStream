

var video = document.getElementById('video');

video.addEventListener('loadeddata', function(e) {
    if (video.readyState === 4) {
        socket.emit('video loaded');
    }
});
video.addEventListener('play', function(e) {
    socket.emit('video playing', );
});

// create an event listener for pausing the video
video.addEventListener('pause', function(e) {
    socket.emit('video paused');
});