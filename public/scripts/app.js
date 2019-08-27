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

// updates the html of the textarea placeholder
document.getElementById("first-submit").onclick = updateTextarea1;
console.log("This is the button being clicked", document.getElementById("first-submit").onclick);

function updateTextarea1 () {
  const numOfPpl = document.getElementById('challenge-number').innerText;
  document.getElementById("challenge-number").placeholder = numOfPpl;
};

// $('input[name=radio]:radio').on('change', function() {
//   $('#target').val( $(this).val() );
// });

});
