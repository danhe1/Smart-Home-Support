/**
 * Created by xshan1 on 1/8/2016.
 */
function initMap() {
	var map;
	var mapID = 0;
	var Address = new Array(
		"Av. Joan Carles I, 64 08908 L’Hospitalet de Llobregat",
		"Carrer de les Ciències 100, 08908 L'Hospitalet de Llobregat",
		"Carrer de la Botànica, 62 08908 L'Hospitalet de Llobregat"
	);
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
	var mapLocation = new Array(
		{lat: 41.354804, lng: 2.128072},//Fira Gran Via
		{lat: 41.351983, lng: 2.120376},//EuroHotel
		{lat: 41.352934, lng: 2.133425} //TravelLodge
	);

	// create Marker
	function createMarker(index) {
		var marker = new google.maps.Marker({
			map: map,
			place: {
				location: mapLocation[index],
				query: 'Google, US'
			},
			attribution: {
				source: 'Google Maps JavaScript API',
				webUrl: 'https://developers.google.com/maps/'
			}
		});
		return marker;
	}

	// fill the infoWindow Content
	function createInfoWindowContent(index) {
		var infoContent = 	'<strong>' + Address[index] + '<br></strong>' +
							'<strong>' + userName[index] + '<br></strong>' +
							'<strong>' + contactInfo[index] + '<br></strong>';
		return infoContent;
	}

	// create google map
	map = new google.maps.Map(document.getElementById('map'), {
		center: mapLocation[0],
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

	// create google map SearchBox
	var input = document.getElementById('searchTextField');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
	var markers = [];
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
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

	var infoWindow = new google.maps.InfoWindow();
	for(var index = 0; index < 3; index++) {
		markers[index] = createMarker(index);
	}
	google.maps.event.addListener(markers[0], 'click', function() {
		mapID = 0;
		infoWindow.setContent(createInfoWindowContent(mapID));
		infoWindow.open(map, this);
		$.energy.house.init(mapID);
		$('#billingTitle > h6').html('Usage for ' + Address[mapID] + ', ' + userName[mapID] + ', ' + contactInfo[mapID]);
		$('#billingTitle > h6').attr('style', 'font-size: 20px');
	});
	new google.maps.event.trigger(markers[0], 'click');

	google.maps.event.addListener(createMarker(1), 'click', function() {
		mapID = 1;
		infoWindow.setContent(createInfoWindowContent(mapID));
		infoWindow.open(map, this);
		$.energy.house.init(mapID);
		$('#billingTitle > h6').html('Usage for ' + Address[mapID] + ', ' + userName[mapID] + ', ' + contactInfo[mapID]);
		$('#billingTitle > h6').attr('style', 'font-size: 20px');
	});
	google.maps.event.addListener(createMarker(2), 'click', function() {
		mapID = 2;
		infoWindow.setContent(createInfoWindowContent(mapID));
		infoWindow.open(map, this);
		$.energy.house.init(mapID);
		$('#billingTitle > h6').html('Usage for ' + Address[mapID] + ', ' + userName[mapID] + ', ' + contactInfo[mapID]);
		$('#billingTitle > h6').attr('style', 'font-size: 20px');
	});

}
