var app = {};

app.latitude = 43.7000;
app.longitude = -79.4000;

app.weatherKey = 'e4190875c1187be4';
app.weatherURL = 'http://api.wunderground.com/api/' + app.weatherKey + '/conditions/q/' + app.latitude + ',' + app.longitude + '.json';
app.getWeather = function(){
	$.ajax ({
		url: 'http://api.wunderground.com/api/' + app.weatherKey + '/conditions/q/' + app.latitude + ',' + app.longitude + '.json',
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


