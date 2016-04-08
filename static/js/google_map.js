/**
 * Created by xshan1 on 1/8/2016.
 */
function initMap() {
	var map;
	//var mapID = 0;

	var userName = new Array(
		'Mr Tom Jones',
		'Ms Mary Lakins',
		'Mr John Cumings'
	);

	var contactInfo = new Array(
		'Ref. 423678',
		'Ref. 436483',
		'Ref. 492372'
	);

	$.getJSON('/get_gateways', function(data) {
            if (data.error != null) {
                console.error('MAP: Cannot get the map list.');
            } else {
                var lmap = data.gateways;
                console.log(lmap);
                createMap(lmap);
            }
    });

	// fill the infoWindow Content
	function createInfoWindowContent(addr, uName, info) {
		var infoContent = 	'<strong>' + addr + '<br></strong>' +
							'<strong>' + uName + '<br></strong>' +
							'<strong>' + info + '<br></strong>';
		return infoContent;
	}

	// create google map
    function createMap(map_list) {
        //  Create a new viewpoint bound
        var bounds = new google.maps.LatLngBounds ();
        //  Go through each...
        for (var i = 0; i< map_list.length; i++) {
            //  And increase the bounds to take this point
            bounds.extend (new google.maps.LatLng(map_list[i].latitude,map_list[i].longitude));
        }
        //  Fit these bounds to the map
        map = new google.maps.Map(document.getElementById('map'), {
            //center: new google.maps.LatLng(map_list[0].latitude, map_list[0].longitude),
            zoom: 15,
            scaleControl: false,
            zoomControl: false,
            mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
                mapTypeIds: [
                    google.maps.MapTypeId.ROADMAP,
                    google.maps.MapTypeId.TERRAIN,
                    google.maps.MapTypeId.SATELLITE
                ],
                position: google.maps.ControlPosition.LEFT_UP
            },
            streetViewControl: false,
            rotateControl: false
        });
        map.fitBounds (bounds);

        // create google map SearchBox
        var input = document.getElementById('searchTextField');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
        addMarkers(map_list);
    }

    function addMarkers(map_list)
    {
        var markers = [];
        var infoWindow = new google.maps.InfoWindow();
        for (var index = 0; index < map_list.length; index++) {
            //markers[index] = createMarker(map_list[index]);
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(map_list[index].latitude, map_list[index].longitude),
                id : index,
                attribution: {
                    source: 'Google Maps JavaScript API',
                    webUrl: 'https://developers.google.com/maps/'
                }
		    });
            markers[index] = marker;
            google.maps.event.addListener(marker, 'click', (function (marker, index) {
                return function() {
                    //infowindow.setContent(boxList[this.id]);
                    //infowindow.open(map, marker);
                    mapID = index;
                    console.log('index: ' + mapID);
                    infoWindow.setContent(createInfoWindowContent(map_list[index].address, userName[mapID], contactInfo[mapID]));
                    infoWindow.open(map, marker);
                    $.energy.house.init(mapID);
                    $('#billingTitle > h6').html('Usage for ' + map_list[index].address + ', ' + userName[mapID] + ', ' + contactInfo[mapID]);
                    $('#billingTitle > h6').attr('style', 'font-size: 20px');
                }
            })(marker, index));
        } // end for

        // trigger clicking on the first location
        new google.maps.event.trigger(markers[0], 'click');

    }

}
