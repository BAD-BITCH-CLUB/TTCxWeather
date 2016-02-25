var app = {};


$(function(){
 app.init();
 $('#end').val('121 Major Street, Toronto');
});
app.init = function(){
	app.getGeolocation();
	$('form').on('submit', function(e) {
		e.preventDefault();
		app.start = app.userLocation;
		app.end = $('input#end').val();
		app.initMap();
		
		
	})
};

app.userLocation = '';
app.x = '';
app.y= '';

/////////////////////////
/////////TTC API/////////
/////////////////////////
app.getGeolocation = function(){
	//if geolocation is available, store longitude and latitutde co-ordinates to put into TTC Ajax call
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			app.x = position.coords.latitude;
			app.y = position.coords.longitude;
			app.userLocation = app.x + ', ' + app.y;

			$.ajax({
				url: 'http://myttc.ca/near/' + app.x + ',' + app.y + '.json',
				method: 'GET',
				dataType: 'jsonp',
			}).then(function(TTCinfo){
				// console.log(TTCinfo.locations);
				// console.log(app.userLocation);
				// console.log(TTCinfo.locations[0].uri);
				// app.TTCinfo = TTCinfo.locations[0].uri;
				app.getTimeforTTC(TTCinfo.locations[0].uri);
			console.log(TTCinfo.locations[0].uri);
			});
		});
		//if geolocation isn't available or the user doesn't accept 
		} else {
			console.log('Nope!');
	};
};


app.getTimeforTTC = function(newTTCinfo){
	var TTCVehicleURL = 'http://myttc.ca/vehicles/near/' + newTTCinfo + '.json';
	console.log(TTCVehicleURL);
	$.ajax({
		url: TTCVehicleURL,
		method: 'GET',
		dataType: 'jsonp'
	}).then (function(vehicleInfo){
		console.log(vehicleInfo);
  	});
 };

var item = $('table.adp-directions tr:nth-child(2) td div')[0]
$(item).find('span:last-child').text()

app.getTrain = function(v) {
var item = $('table.adp-directions tr:nth-child(2) td div')[0]
 var pizza = $(item).find('span:last-child').text();
 console.log(pizza);
}



//////////////////////////
////////GOOGLE MAPS///////
//////////////////////////
app.initMap = function() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: { lat: app.x, lng: app.y},
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
		travelMode: google.maps.TravelMode.TRANSIT
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(response);
		  //Call setInterval, store it in a var
		  // it will return an id that we need to clear
		  var interval = setInterval(function() {
		  	//If selector gets something
		  	if($('.adp-directions').length > 0) {
		  		//Clear the interval
		  		clearInterval(interval)
		  		//get train
		  		app.getTrain();
		  	}
		  },100);
		  
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


/////////////////////PSUEDO CODE/////////////////////

// Collect user's starting location using geolocation

// Display the current weather conditions

// Change the css of the logo icon to correspond with the weather conditions  

// Collect the user's desired destination

//TTC - using the "name" from the first ajax call pass it into a second to get "vehicles near name" - take the velocity and distance and figure out how far away the streetcar is

// Display how long it will take to get them from point a - b if they walk and if they take the TTC

// from what the user selects (walking or ttc) store selected travel mode in a variable to be passed through google for the route map (conditional statements)

// WALKING - display a route map with detailed directions getting them from a - b 

// TTC - display a route map 

// Give the user the option to change their mind and view directions/ route of the other travel mode

 