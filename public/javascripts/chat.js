$(function() {
  var socket = io();
  $('#socket').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  /*socket.on('chat message', function(msg){
    $('#message').append($('<li>').text($('#m').val());*/

    socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});