var app = {};


app.init = function(){
	app.getGeolocation();
	$('form').on('submit', function(e) {
		e.preventDefault();
		app.start = $('input#start').val();
		app.end = $('input#end').val();
		app.initMap();
	})
	// app.calculateAndDisplayRoute();
};

app.start = '';
app.end = '';

/////////////////////////
/////////TTC API/////////
/////////////////////////


app.getGeolocation = function(){
	//if geolocation is available, store longitude and latitutde co-ordinates to put into TTC Ajax call
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			var x = position.coords.latitude;
			var y = position.coords.longitude;

			$.ajax({
				url: 'http://myttc.ca/near/' + x + ',' + y + '.json',
				method: 'GET',
				dataType: 'jsonp',
			}).then(function(TTCinfo){
				console.log(TTCinfo.locations);
			});
		});
		//if geolocation isn't available or the user doesn't accept 
		} else {
			console.log('Nope!');
	};
};
// app.map;

app.initMap = function() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: { lat: 41.85, lng: -87.65},
  });

  directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var control = document.getElementById('floating-panel');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

	app.calculateAndDisplayRoute(directionsService, directionsDisplay);

}

// directionsDisplay.setPanel(document.getElementById('right-panel'));

// var startPoint = {
// 	lat: 43.648325,
// 	lng: -79.397893
// }

// var endPoint = {
// 	lat: 43.660821,
// 	lng: -79.403821
// }
// origin: new google.maps.LatLng({lat: -34, lng: 151}), 
// 		destination: new google.maps.LatLng({lat: -32, lng: 149}), 

// app.userEnd = prompt('What is the address of where you want to go?');

app.calculateAndDisplayRoute = function(directionsService, directionsDisplay){
	directionsService.route({
		origin: app.start,
		destination: app.end,
		travelMode: google.maps.TravelMode.WALKING
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(response);
		} else {
		  window.alert('Directions request failed due to ' + status);
		}
	});
}




////////////////////////
///////WUNDERGROUND/////
////////////////////////


app.latitude = 43.7000;
app.longitude = -79.4000;

app.weatherKey = 'e4190875c1187be4';
app.weatherURL = 'http://api.wunderground.com/api/' + app.weatherKey + '/conditions/q/' + app.latitude + ',' + app.longitude + '.json';
app.getWeather = function(){
    $.ajax ({
        url: app.weatherURL,
        method: 'GET',
        dataType: 'json'

    }).then(function(info){
        console.log(info);
    });
}

// Updated upstream

app.getWeather();

// Stashed changes



$(function(){
 app.init();
});


