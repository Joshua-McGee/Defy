let map;
let bounds;
let arr;

function initMap(genre) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });

    bounds = new google.maps.LatLngBounds();

  $.get(`/api/challenges/genres/${genre ? genre : 'Everything'}`, (res) => {

    arr = res.data.rows;

    for (var key in arr) {

      let data = arr[key];

      let content = `
        <div>Event: ${data.challenge_name}</div>
        <div>Address: ${data.address}</div>
      `;

      let infowindow = new google.maps.InfoWindow({
        content
      });

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng (data.lat, data.long),
        map: map,
        title: key
      });

      marker.addListener('hover', function() {
        infowindow.open(map.marker);
      });

        marker.addListener('click', function() {
          let modal = $('#modal');
          let modalContent = $('#modal-content');
          let newDiv = $('<div>');
          let exit = $('<button>');
          exit.addClass('exit');
          exit.html('&times;');
          modalContent.append(newDiv);

          let headerDiv = $('<div>');
          headerDiv.append($('<label>').text(`${data.challenge_name} - Challenge`).addClass('header-padding'));
          headerDiv.append(exit);
          headerDiv.addClass('header');
          switch(data.genre) {
            case 'Physical':
              headerDiv.addClass('blue');
            break;

            case 'Mental':
              headerDiv.addClass('green') ;
            break;

            case 'Game':
              headerDiv.addClass('red');
            break;

            case 'Random':
              headerDiv.addClass('orange');
            break;
          };

          let infoDiv = $('<div>');
          infoDiv.addClass('info');

          let dLDiv = $('<div>');
          dLDiv.addClass('dl');
          let dateDiv = $('<div>');
          dateDiv.append($('<label>').text('Date'));
          dateDiv.append($('<p>').text(`${data.date}`));
          dateDiv.addClass('date');
          let locationDiv = $('<div>');
          locationDiv.append($('<label>').text('Location'));
          locationDiv.append($('<p>').text(`${data.address}`));
          locationDiv.addClass('location');

          //appends date and location into date and location div
          dLDiv.append(dateDiv);
          dLDiv.append(locationDiv);

          let descriptionDiv = $('<div>');
          descriptionDiv.append($('<label>').text('Description'));
          descriptionDiv.addClass('description');
          descriptionDiv.append($('<p>').text(data.description));

          //adds date location and description into a div
          infoDiv.append(dLDiv);
          infoDiv.append(descriptionDiv);

          let acceptBtn = $('<button>');
          if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != data.user_id){
            acceptBtn.addClass('accept');
            acceptBtn.text('Accept');
            switch(data.genre) {
              case 'Physical':
                acceptBtn.addClass('blue');
              break;

              case 'Mental':
                acceptBtn.addClass('green') ;
              break;

              case 'Game':
                acceptBtn.addClass('red');
              break;

              case 'Random':
                acceptBtn.addClass('orange');
              break;
            };

            acceptBtn.click(() => {
              $.post('/api/users/apply', {
                id: localStorage.getItem('user_id'),
                challenge_id: data.id
              })
              .then((result) => {
                modal.removeClass('show');
                modal.addClass('hide');
                newDiv.remove();
              });
            });
        }else{
          acceptBtn.hide();
        }

          newDiv.append(headerDiv);
          newDiv.append(infoDiv);
          if(localStorage.getItem('user_id') !== data.user_id){
            newDiv.append(acceptBtn);
          }

          exit.click(() => {
            modal.removeClass('show');
            modal.addClass('hide');
            newDiv.remove();
          });

        modal.removeClass('hide');
        modal.addClass('show');
      });
      bounds.extend(marker.position);
    }
    map.fitBounds(bounds); //-> use this one to show more than one point
  });

  function setupClickListener(id, types) {
    var radioButton = $(`#${id}`);
    radioButton.click(() => {
      initMap(types[0]);
    });
  }

  setupClickListener('everything', ['Everything']);
  setupClickListener('physical', ['Physical']);
  setupClickListener('mental', ['Mental']);
  setupClickListener('game', ['Game']);
  setupClickListener('random', ['Random']);

}

$('#pac-input').click(() => {
  let modal = $('#modal');
  let modalContent = $('#modal-content');
  let newDiv = $('<div>');
  let exit = $('<button>');
  exit.addClass('exit');
  exit.html('&times;');
  modalContent.append(newDiv);

  let headerDiv = $('<div>');
  headerDiv.append($('<label>').text(`Select Type: `));
  headerDiv.append(exit);
  headerDiv.addClass('header');

  newDiv.append(headerDiv);

  let selectionDiv = $('<div>');
  selectionDiv.addClass('selection');

  let everythingInput = $(`
  <div>
    <input type="radio" name="filter" value="Everything" checked>
    <label>Everything</label>
  </div>`);

  let physicalInput = $(`
  <div>
    <input type="radio" name="filter" value="Physical">
    <label>Physical</label>
  </div>`);

  let mentalInput = $(`
  <div>
    <input type="radio" name="filter" value="Mental">
    <label>Mental</label>
  </div>`);

  let gameInput = $(`
  <div>
    <input type="radio" name="filter" value="Game">
    <label>Game</label>
  </div>`);

  let randomInput = $(`
  <div>
    <input type="radio" name="filter" value="Random">
    <label>Random</label>
  </div>`);

  selectionDiv.append(everythingInput);
  selectionDiv.append(physicalInput);
  selectionDiv.append(mentalInput);
  selectionDiv.append(gameInput);
  selectionDiv.append(randomInput);

  newDiv.append(selectionDiv);


  $('input[name=filter]:radio').on('change', (e) => {
    $('#pac-input').val(e.target.value);
    initMap(e.target.value);
  });

  exit.click(() => {
    modal.removeClass('show');
    modal.addClass('hide');
    newDiv.remove();
  });

  modal.removeClass('hide');
  modal.addClass('show');
});
