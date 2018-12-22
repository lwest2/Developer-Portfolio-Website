var limit = 200;

$("document").ready(function() {
  // sets initial count to 200
  $("#displayCounter").text(limit.toString());
});

$("#comment").keyup(function() {
  // gets length of textarea
  var length = $("#comment").val().length;
  if (length <= 200) {
    var newLength = limit - length;
  }
  // displays newlegnth
  $("#displayCounter").text(newLength.toString());
});

$("#comment").focus(function() {
  // col display on
  $(".blogpostbtnHelper").css("max-height", "50px")
});

$("#comment").focusout(function() {
  $(".blogpostbtnHelper").css("max-height", "0px")
});