$('#my-challenges').click(() => {
  $('.created').removeClass('hide');
  $('#accepted-challenges').removeClass('active');
  $('.accepted').addClass('hide');
  $('#my-challenges').addClass('active');
});

$('#accepted-challenges').click(() => {
  $('.accepted').removeClass('hide');
  $('#my-challenges').removeClass('active');
  $('.created').addClass('hide');
  $('#accepted-challenges').addClass('active');
});


$('.delete').click(function(){
  if($(this).attr('accepted')){
    $.ajax({
      url: '/api/users/',
      data: {
        challenge_id: $(this).attr('challenge_id'),
        id: localStorage.getItem('user_id')
      },
      type: 'DELETE',
      success: (result) => {
        location.reload();
      }
    });
  } else {
    $.ajax({
      url: '/api/challenges/',
      data: {
        challenge_id: $(this).attr('challenge_id'),
        id: localStorage.getItem('user_id')
      },
      type: 'DELETE',
      success: (result) => {
        location.reload();
      }
    });
  }
})
