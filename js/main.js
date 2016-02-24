/////////////////////////
/////////TTC API/////////
/////////////////////////
var appTTC = {};

$(function(){
	appTTC.init();
});

appTTC.init = function(){
	appTTC.getGeolocation();
};

appTTC.getGeolocation = function(){
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


////////////////////////
///////WUNDERGROUND/////
////////////////////////
var app = {};

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


app.init = function(){
	app.getWeather();
}

$(function(){
 app.init();
});

