$(function(){
  $( "#like" ).click(function(e) {
    var count = Number($('#like_count').text());
    count += 1;
    $('#like_count').text(count);
  });
});