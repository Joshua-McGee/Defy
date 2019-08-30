// this is where the data for the forms is going to be stored
const data = { genre: 'Physical', userId: localStorage.getItem('user_id') };

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 49.2827, lng: -123.1207},
      zoom: 14,
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
    const input = document.getElementById('pac-input');
    const autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    const marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    // sends the coordinates to our data object
    document.getElementById("third-submit").addEventListener('click', () => {
      let place = autocomplete.getPlace();
      // data should be a string
      let shortAddress = String((place.address_components[0].short_name) + " " + (place.address_components[1].short_name));
      //send the data to our data object and give it keys/values
      data.location = {name: place.name, address: shortAddress, lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
      document.getElementById("third-box").value = place.name;
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
  };

  // update the data if the everyone button is clicked to be infinit (-1)
  $("#challenge-everyone").click(() => {
    data.maxOccupancy = -1;
    $("#first-box").val('Everyone');
  });

  // update the data object to be equal to a number that is typed in the input
  $("#challenge-number").keyup((e) => {
    numOfPpl = e.target.value;
    data.maxOccupancy = numOfPpl;
    $("#first-box").val(numOfPpl + " people");
  });

  // select the radio and update our data object with the selected one
  $('input[name=radio]:radio').on('change', (e) => {
    switch(e.target.value) {
      case 'Physical':
        $(".top-color").removeClass('green').removeClass('red').removeClass('orange').addClass('blue');
        break;
      case 'Mental':
        $('.top-color').removeClass('blue').removeClass('red').removeClass('orange').addClass('green');
        break;
      case 'Game':
        $('.top-color').removeClass('blue').removeClass('green').removeClass('orange').addClass('red');
        break;
      case 'Random':
        $('.top-color').removeClass('blue').removeClass('green').removeClass('red').addClass('orange');
      break;
  };
      data.genre = e.target.value;
  });

  // Posts challenge data to be inputted into the database
  $('#create-challenge-btn').click(() => {
    $.post('/api/challenges/', {data})
    .then(() => {
      window.location.replace(`http://localhost:8080/api/users/${localStorage.getItem('user_id')}`);
    })
  });

  // Challenge name is added to the data object and populated in the value of the input
  $("#challenge-name").keyup((e) => {
    nameOfChallenge = e.target.value;
    data.challengeName = nameOfChallenge;
    $("#second-box").val(nameOfChallenge);
  });

  // Challenge description is added to the data object with the key description
  $("#challenge-description").keyup((e) => {
    description = e.target.value;
    data.description = description;
  });

  //Adds the date data from our input to our data object
  $("#date-data").change((e) => {
    let input = e.target.value;
    let dateEntered = new Date(input);
    data.time = dateEntered;
  });

/* Open Form*/
  function openNav() {
    document.getElementById("myNav").style.display = "block";
  }

  function openNav2() {
    document.getElementById("myNav2").style.display = "block";
  }

  function openNav3() {
    document.getElementById("myNav3").style.display = "block";
  }

  /* Close Form*/
  function closeNav() {
    document.getElementById("myNav").style.display = "none";
  }

  function closeNav2() {
    document.getElementById("myNav2").style.display = "none";
  }

  function closeNav3() {
    document.getElementById("myNav3").style.display = "none";
  }
