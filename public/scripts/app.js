$(document).ready(function () {

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});


$('#challenge-everyone').on('click',function() {
    if($(this).hasClass('everybody'))
        $(this).removeClass('everybody').addClass('everybodyClicked');
        else
  $(this).removeClass('everybodyClicked').addClass('everybody');
});

});
