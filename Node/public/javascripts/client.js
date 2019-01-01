$(document).ready(function() {

  var inputMsg = $('#messageChat')[0];

  var socket = io.connect('http://127.0.0.1:3000');

  console.log("Socket is: " + socket);

  if (socket !== undefined) {
    console.log("Connected to socket.");

    socket.emit('new user');
    // display messages on connect


    socket.emit('display', {
      selectedUser: $('#Select').val()
    });

    // send message
    $('#sendmsgBtn').on('click', function(event) {
      socket.emit('input', {
        message: inputMsg.value,
        selectedUser: $('#Select').val()
      });

      inputMsg.value = '';

      event.preventDefault();
    });

    $('#messageChat').on('keydown', function(event) {
      // if key code enter
      if (event.which === 13 && event.shiftKey == false) {
        // emit to server input
        socket.emit('input', {
          message: inputMsg.value,
          selectedUser: $('#Select').val()
        });

        inputMsg.value = '';

        event.preventDefault();
      }
    });
    // end send message

    // Select user if Admin
    $('#Select').change(function() {
      socket.emit('display', {
        selectedUser: $('#Select').val()
      });
      updateScroll();
    });

    // load messages before
    socket.on('load messages', function(data) {
      // go through array and append messages into outputMessages
      var docs = data.messages;
      $('#outputMessages').html("");

      if (docs.length) {
        for (var i = 0; i < docs.length; i++) {
          $('#outputMessages').prepend("<li class='list-group-item'><b>[" + docs[i].date + "] <br/>" + docs[i].author + ":</b> " + docs[i].message + "</li>");
        }
      }
      updateScroll();

    });

    socket.on('updateUsers', function(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "liamwest1@hotmail.com") {
          $('#Select').append('<option>' + data[i] + '</option>');
        }
      }
      socket.emit('display', {
        selectedUser: $('#Select').val()
      });
    });

    socket.on('new message', function(data) {

      $('#outputMessages').append("<li class='list-group-item'><b>[" + data.date + "] <br/>" + data.author + ":</b> " + data.message + "</li>");
      updateScroll();
    });

    function updateScroll() {
      $('.overflowHelper').animate({
        scrollTop: $('.overflowHelper').prop("scrollHeight")
      }, 1000);
    }
  }
});