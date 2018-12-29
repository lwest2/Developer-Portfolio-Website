$(document).ready(function() {
  var inputMsg = $('#messageChat')[0];
  var outputMsg = $('#outputMessages')[0];

  var socket = io.connect('http://127.0.0.1:3000');

  console.log("Socket is: " + socket);

  if (socket !== undefined) {
    console.log("Connected to socket.");

    $('#sendmsgBtn').on('click', function(event) {

      socket.emit('input', {
        message: inputMsg.value
      });

      event.preventDefault();
    });

    $('#messageChat').on('keydown', function(event) {
      // if key code enter
      if (event.which === 13 && event.shiftKey == false) {
        // emit to server input
        socket.emit('input', {
          message: inputMsg.value
        });
        inputMsg.value = '';
        event.preventDefault();
      }
    });
  }
});