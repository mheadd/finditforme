      function doSearch() {
        var types = document.getElementById('search').value.toLowerCase();
        service = new google.maps.places.PlacesService(map);

        var request = {
          location: mapCenter,
          rankBy: google.maps.places.RankBy.DISTANCE,
          types: [types]
        };

        service.search(request, placeMarkers);
      }

      function setBanner(num) {
        var type = document.getElementById('search').value
        document.getElementById('banner').innerHTML = "Result: " + num + " <strong>" + type.replace(/_/g, " ").toUpperCase() + "</strong> places found.";
      }

      function placeMarkers(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          map.clearAllMarkers();
          setBanner(results.length);
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
        else {
          console.log('ERROR: ' + status);
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        markersArray.push(marker);
        
        var windowContent = '<div>';
        windowContent += '<strong>' + place.name + '</strong><br/>';
        windowContent += place.rating ? 'Rating: ' + place.rating + '<br/>' : '';
        windowContent += 'Address: ' + place.vicinity;
        windowContent += '</div>';
        addInfoWindow(marker, windowContent);
      }

      google.maps.Map.prototype.clearAllMarkers = function() {
        if (markersArray) {
          for (var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
          }
        }
      }
      
      function addInfoWindow(marker, content) {
          var infowindow = new google.maps.InfoWindow({ content: content });

          google.maps.event.addListener(marker, 'click', function() {
            if(openedInfoWindow) {
              openedInfoWindow.close();
            }
            infowindow.open(map, marker);
            openedInfoWindow = infowindow;  
          });
      }

      function init() {      

        // Place the "You are Here" incon on map load.
        function setCenterMarker() {
          var marker = new google.maps.Marker({
            position: mapCenter,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/blue-dot.png',
            title:"You are here!"
          });
        }

        // Create a div to hold the search form.
        var searchDiv = document.createElement('div');
        var searchForm = document.createElement('form');
        searchForm.setAttribute('onsubmit', 'doSearch()');
        searchForm.setAttribute('action', '#');
        searchDiv.appendChild(searchForm);

        var searchInput = document.createElement('select');
        searchInput.setAttribute('onchange', 'doSearch()');
        searchInput.setAttribute('id', 'search');
        searchForm.appendChild(searchInput);

        var defualtOption = document.createElement('option');
        defualtOption.setAttribute('value', 'Pick a place type');
        searchInput.appendChild(defualtOption);

        for(places in placeTypes) {
          var searchOption = document.createElement('option');
           searchOption.innerHTML = places.replace(/_/g, " ");
           searchOption.setAttribute('value', placeTypes[places]);
           searchInput.appendChild(searchOption);
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        if(navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
           mapCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
           map.setCenter(mapCenter);
           setCenterMarker()
          });
        }
        else {
         mapCenter = new google.maps.LatLng(39.952335, -75.163789);
         map.setCenter(mapCenter);
         setCenterMarker()
        }


        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(searchDiv);

      }

      var map;
      var markersArray = [];
      var openedInfoWindow = null;
      var mapCenter;
      var mapOptions = {
        zoom: 16,
        disableDefaultUI: true,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      google.maps.event.addDomListener(window, 'load', init);