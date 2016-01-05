$(function(){
  $( ".like" ).click(function(e) {
    var count = Number($(this).next().text());
    count += 1;
    $(this).next().text(count);
  });
});