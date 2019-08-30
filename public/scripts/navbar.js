let user_id = localStorage.getItem('user_id');

$('#nav-user').text(user_id == 1 ? 'Joshua' : (user_id == 2 ? 'Gary': ''));
$('#nav-user').attr('href', `/api/users/${localStorage.getItem('user_id')}`);
if(!localStorage.getItem('user_id')){
  $('.create').hide();
}

$('.login-button').click(() => {
  user_id = localStorage.getItem('user_id');
  $('#nav-user').attr('href', `http://localhost:8080/api/users/${user_id}`);
  $('#nav-user').text(user_id == 1 ? 'Joshua' : (user_id == 2 ? 'Gary': ''));
  if(user_id){
    window.location.replace(`http://localhost:8080/api/users/${user_id}`);
  }else{
    window.location.replace(`http://localhost:8080/`);
  }
});
