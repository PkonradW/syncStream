var socket=io();
form = document.getElementById("rname").submit();
form.addEventListener('submit', function(e) {
	e.preventDefault();
	if (rname.value) {
		socket.emit('join room', rname.value);
	}
	});
function myFunction(){
	window.location.href="localhoast:3000/index"
}