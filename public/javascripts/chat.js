$(function() {
  console.log('loaded!');
  var socket = io();
  $('#socket').submit(function(e){
    e.preventDefault();
    console.log('msg sent!');
    var author_name = $('#author_name').val();
    var message = $('#message').val();
    var photo = $('#photo').val();
    var author_id = $('#author_id').val();
    var recipient_id = $("#recipient_id").val();
    var body = {message: message, author: author_id, photo: photo, author_name: author_name, recipient: recipient_id};
    socket.emit('chat message', body);
    $('#message').val('');
  });
  /*socket.on('chat message', function(msg){
    $('#message').append($('<li>').text($('#m').val());*/
    // "msg" below is the "body" object from above (line 10)
    socket.on('chat message', function(msg){
    $('#messages').append('<img src="'+msg.photo+'" class="img-circle" height="35px" class="img-circle"width="35px">').append($('<li>').text(msg.author_name + ': ' + msg.message));
  });
});
