$(function() {
  console.log('loaded!');
  var socket = io();
  $('#socket').submit(function(e){
    e.preventDefault();
    console.log('msg sent!');
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  });
  /*socket.on('chat message', function(msg){
    $('#message').append($('<li>').text($('#m').val());*/

    socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});