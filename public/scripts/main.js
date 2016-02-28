'use strict';

var app = {};

app.latitude = 43.7000;
app.longitude = -79.4000;
app.closeStreetCar = '';
app.goodPizza = '';
app.userLocation = '';
app.x = 0;
app.y = 0;
app.longNames = [];
app.finalMinutes = '';
app.nextTTC = '';
app.chocolateIceCream = '';
app.travelMode = '';
var timeblock = '';

$(function () {
	app.init();
	$('#end').val();
});

app.init = function () {
	app.getGeolocation();

	$('form').on('submit', function (e) {
		e.preventDefault();
		console.log('yolo');

		app.start = app.userLocation;
		app.end = $('input#end').val();
		// app.initMap();
		// app.calculateAndDisplayRoute(app.directionsService, app.directionsDisplay);
	});
};

/////////////////////////
/////////TTC API/////////
/////////////////////////
app.getGeolocation = function () {

	//if geolocation is available, store longitude and latitutde co-ordinates to put into TTC Ajax call
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {

			app.x = position.coords.latitude;
			app.y = position.coords.longitude;
			app.userLocation = app.x + ', ' + app.y;

			$.ajax({
				url: 'http://myttc.ca/near/' + app.x + ',' + app.y + '.json',
				method: 'GET',
				dataType: 'jsonp'
			}).then(function (TTCinfo) {
				app.getTimeforTTC(TTCinfo.locations[0].uri);
			});
		});
		//if geolocation isn't available or the user doesn't accept
	} else {
			console.log('Nope!');
		};
};

app.getTimeforTTC = function (newTTCinfo) {
	var TTCVehicleURL = 'http://myttc.ca/vehicles/near/' + newTTCinfo + '.json';
	console.log(TTCVehicleURL);
	$.ajax({
		url: TTCVehicleURL,
		method: 'GET',
		dataType: 'jsonp'
	}).then(function (vehicleData) {
		var vehicleInfo = [];
		vehicleData.vehicles.forEach(function (val, i) {
			vehicleInfo.push(val);
		});
		// console.log(vehicleInfo)
		app.trainData = vehicleInfo;
		console.log(vehicleInfo);
	});
};

app.getTrain = function () {
	var item = $('table.adp-directions tr:nth-child(2) td div')[0];
	var pizza = $(item).find('span:last-child').text();

	if (pizza.length > 0) {
		var splitPizza = pizza.split('- ');
		app.goodPizza = splitPizza[1];
	}

	timeblock = $('div.adp div.adp-summary span:last-child span').text();

	var timeSplit = timeblock.split('mins');
	var timeFinal = timeSplit.join(' ');
	$('.ttc span.ttcTotal').text(timeFinal);

	var googleMapNextTrain = $('div.adp div:nth-child(3) div:nth-child(2) table.adp-directions tbody tr:nth-child(2) td.adp-substep div:nth-of-type(2) span:first-child span:first-child').text();
	console.log("next-train time:" + googleMapNextTrain);

	var noPMstring = googleMapNextTrain.split('pm' || 'am');
	var noPM = noPMstring.join('');
	console.log(noPM);

	var finalstring = noPM.split(':');
	app.finalMinutes = +finalstring[0] * 60 + +finalstring[1];

	var goodTime = formatTime(new Date());
	var splitTime = goodTime.split('pm' || 'am');
	var finalTime = splitTime.join('');

	var hm = finalTime; // your input string
	var a = hm.split(':'); // split it at the colons

	// Hours are worth 60 minutes.
	var currentMinutes = +a[0] * 60 + +a[1];

	console.log(currentMinutes);

	app.nextTTC = app.finalMinutes - currentMinutes;
	console.log('your next TTC arrives in ' + app.nextTTC);

	var iceCream = $('div.adp div:nth-child(3) div:nth-child(2) table.adp-directions tbody tr:first-child td.adp-substep div:first-of-type span:nth-of-type(2)').text();
	console.log('this is your stop' + iceCream);

	var mintIceCream = iceCream.split('Walk to');
	app.chocolateIceCream = mintIceCream.join(' ');
	console.log('your stop is at' + app.chocolateIceCream);

	$('span.TTCminutes').text(app.nextTTC);
	$('span.ttcStop').text(app.chocolateIceCream);

	var hustleTime = $('div.adp div:nth-child(3) div.adp-summary span:nth-child(3)').text();
	console.log(hustleTime);
	$('span.walkTime').text(hustleTime);

	app.bestTrain();
};

app.bestTrain = function () {
	app.trainData.forEach(function (val, i) {
		var preLongName = val.long_name;
		var velocity = val.velocity;
		var distance = val.distance;
		var split = preLongName.split('To');
		var finalLongName = split.join('Towards');
		var vehicleObject = {
			name: finalLongName,
			velo: velocity,
			dist: distance
		};

		// console.log(vehicleObject);

		app.longNames.push(vehicleObject);
	});
	app.longNames.forEach(function (val, i) {
		if (val.name === app.goodPizza) {
			app.userTrain(app.longNames[i]);
		} else {
			console.log('sorry!');
		}
	});
};

app.userTrain = function (theTrain) {
	console.log(theTrain.name);
	console.log('velocity ' + theTrain.velo);
	console.log('distance ' + theTrain.dist);
	var time = Math.floor(theTrain.dist / theTrain.velo / 10);
	console.log(time + ' Minutes away');
	if (time < 0.5) {
		console.log('The train is approaching');
	}
	// console.log(theTrain);
};

//////////////////////////
////////GOOGLE MAPS///////
//////////////////////////

app.initMap = function () {
	app.directionsService = new google.maps.DirectionsService();
	app.directionsDisplay = new google.maps.DirectionsRenderer();
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: { lat: app.x, lng: app.y }
	});

	app.directionsDisplay.setMap(map);
	app.directionsDisplay.setPanel(document.getElementById('right-panel'));

	var control = document.getElementById('floating-panel');
	// control.style.display = 'block';
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
};

app.calculateAndDisplayRoute = function () {
	console.log('CalculateAndDisplayRoute called, travel mode is: ' + app.travelMode);
	app.directionsService.route({
		origin: app.start,
		destination: app.end + ', Toronto',
		travelMode: app.travelMode
	}, function (response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			app.directionsDisplay.setDirections(response);
			//Call setInterval, store it in a var
			// it will return an id that we need to clear
			var interval = setInterval(function () {
				//If selector gets something
				if ($('.adp-directions').length > 0) {
					//Clear the interval
					clearInterval(interval);
					//get train
					app.getTrain();
				}
			}, 100);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
};

////////////////////////
///////WUNDERGROUND/////
////////////////////////

app.weatherKey = 'e4190875c1187be4';
app.weatherURL = 'http://api.wunderground.com/api/' + app.weatherKey + '/conditions/q/' + app.latitude + ',' + app.longitude + '.json';
app.getWeather = function () {
	$.ajax({
		url: app.weatherURL,
		method: 'GET',
		dataType: 'json'

	}).then(function (info) {
		console.log(info);
		app.displayWeather(info);
	});
};

// Updated upstream

app.getWeather();

// Stashed changes

//////////////////////
/////FUNCTIONALITY////
//////////////////////

///////////////////////
////WEATHER DISPLAY////
//////////////////////

$('#submit').on('click', function () {
	$('div.window').addClass('hide');
	$('div.laterContent').toggle();
});

app.displayWeather = function (torontoWeather) {
	var weatherInfo = torontoWeather.current_observation;
	console.log(weatherInfo);

	$('span.weather').text(weatherInfo.weather);
	$('span.temp_c').text(weatherInfo.temp_c);
	$('span.feelsLikeTemp').text(weatherInfo.feelslike_c);

	var icon = weatherInfo.icon;

	if (icon === "mostlycloudy" || icon === "mostlysunny" || icon === "partlycloudy" || icon === "partlysunny" || icon === "partlycloudy") {

		$('div.laterContent div.partSun').toggle();
	} else if (icon === "clear" || icon === "sunny") {
		$('div.laterContent div.sun').toggle();
	} else if (icon === "chancerain" || icon === "chancetstorms" || icon === "rain" || icon === "tstorms") {
		$('div.laterContent div.rain').toggle();
	} else if (icon === "chanceflurries" || icon === "chancesleet" || icon === "sleet" || icon === "flurries" || icon === "snow" || icon === "chancesnow") {
		$('div.laterContent div.snow').toggle();
	} else if (icon === "cloudy" || icon === "fog" || icon === "hazy") {
		$('div.laterContent div.cloud').toggle();
	}
};

app.displayTime = function () {};

///////////////////////
/////ROUTE DISPLAY/////
//////////////////////

var formatTime = function () {
	function addZero(num) {
		return num >= 0 && num < 10 ? "0" + num : num + "";
	}

	return function (dt) {
		var formatted = '';

		if (dt) {
			var hours24 = dt.getHours();
			var hours = (hours24 + 11) % 12 + 1;
			formatted = [formatted, [addZero(hours), addZero(dt.getMinutes())].join(":"), hours24 > 11 ? "pm" : "am"].join(" ");
		}
		return formatted;
	};
}();

$('button.walk').on('click', function () {
	console.log('Walking button clicked');
	// $('button.goBack').toggle();
	$('.laterContent').toggle();
	$('div.viewMap').toggle();
	$('.wholeMap').toggle();
	$('.mapTitle').toggle();
	$('.mapTitleWalk').toggle();
	app.travelMode = 'WALKING';
	app.initMap();
	app.calculateAndDisplayRoute();
});

$('button.ttc').on('click', function () {
	console.log('Transit button clicked');
	// $('button.goBack').toggle();
	$('.laterContent').toggle();
	app.travelMode = 'TRANSIT';
	app.initMap();
	app.calculateAndDisplayRoute();
	$('.wholeMap').toggle();
	$('div.viewMap').toggle();
	// $('span.TTCminutes').text(app.nextTTC);
	// $('span.ttcStop').text(app.chocolateIceCream);
	console.log(app.chocolateIceCream);
	console.log(app.nextTTC);
});

$('button.goBack').on('click', function () {
	location.reload();
});

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
//# sourceMappingURL=main.js.map
