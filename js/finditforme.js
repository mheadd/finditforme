      // Catch form submissions
      function doNothing() {
        return;
      }

      // Search for places through the Google Places API.
      function doSearch() {
        var selection = document.getElementById('searchField').value.replace(/\s/g, "_");
        types = placeTypes[selection];
        service = new google.maps.places.PlacesService(map);
         var request = {
           location: mapCenter,
           rankBy: google.maps.places.RankBy.DISTANCE,
           types: [types]
         };
        service.search(request, placeMarkers);
      }

      // Place markers on te map.
      function placeMarkers(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          map.clearAllMarkers();
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
        else {
          console.log('ERROR: ' + status);
        }
      }

      // Create a marker.
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

      // Clear markers from the map.
      google.maps.Map.prototype.clearAllMarkers = function() {
        if (markersArray) {
          for (var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
          }
        }
      }
      
      // Add an info window with place details to a marker.
      function addInfoWindow(marker, content) {
          var infowindow = new google.maps.InfoWindow({ content: content });
          infowindow.setOptions({ maxWidth: 150 }); 

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
        function setCenterMarker(mapCenter) {
          var marker = new google.maps.Marker({
            position: mapCenter,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'img/green-dot.png',
            title:"You are here!"
          });
        }

        // Create map.
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var bikeRackLayer = new google.maps.KmlLayer('http://gis.phila.gov/ArcGIS/rest/services/Streets/Bike_Racks/MapServer/0/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=1%3D1&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=kmz');

        // Get location for map center.
        if(navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
           mapCenter = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
           bikeRackLayer.setMap(map);
           map.setCenter(mapCenter);
           setCenterMarker(mapCenter);
          });
        }
        else {
         mapCenter = new google.maps.LatLng(39.952335, -75.163789);
         bikeRackLayer.setMap(map);
         map.setCenter(mapCenter);
         setCenterMarker(mapCenter);
        } 

      }    

      // Map settings.
      var map;
      var markersArray = [];
      var openedInfoWindow = null;
      var mapCenter;
      var mapOptions = {
        zoom: 15,
        disableDefaultUI: true,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Create map on page load.
      google.maps.event.addDomListener(window, 'load', init);