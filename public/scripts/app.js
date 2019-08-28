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

// // this is where the data for the forms is going to be stored
// let data = {};
// console.log('this is the data', data);

// // update the data if the everyone button is clicked to be infinit (-1)
// document.getElementById("challenge-everyone").addEventListener('click', () => {
//   data.numberOfChallengers = -1;
//   document.getElementById("first-box").value = 'Everyone';
// });

// // update the data object to be equal to a number that is typed in the input
// document.getElementById("challenge-number").addEventListener('keyup', (e) => {
//   numOfPpl = e.target.value;
//   data.numberOfChallengers = numOfPpl;
//   document.getElementById("first-box").value = numOfPpl + " people";
// });

// // select the radio and update our data object with the selected one
// $('input[name=radio]:radio').on('change', (e) => {
//     data.genre = e.target.value;
// });

// // Challenge name is added to the data object and populated in the value of the input
// document.getElementById("challenge-name").addEventListener('keyup', (e) => {
//   nameOfChallenge = e.target.value;
//   data.challengeName = nameOfChallenge;
//   document.getElementById("second-box").value = nameOfChallenge;
// });

// // Challenge description is added to the data object with the key description
// document.getElementById("challenge-description").addEventListener('keyup', (e) => {
//   description = e.target.value;
//   data.description = description;
// });

});
