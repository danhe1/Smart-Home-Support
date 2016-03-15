/**
 * update weather and do this work every 1 hour
 */
var tryTimes = 5;
var checkTimes = 0;
var weatherUpdated = 0;
var iconCode;
var iconText;
var temperature;
var humidity;
var speed;

/**
 * get the yahoo weather woeid
 * woeid: accurate to town of county
 */
function updateWeather() {
	console.log("updating weather ...");
	// located to the MWC conference venus: Fira Gran Via, Barcelona
	var lat = 41.354804;
	var lon = 2.128072;
	// position: can put name or lat/lon in place. Use lan&lon makes the request faster.
	//var position = "Spain Barcelona";
	var position = "" + lat + "," + lon;

	var woeid;
	var myYahooAppID = 'dj0yJmk9dmF1WDVUMlZoaVJ6JmQ9WVdrOWFFRkVOVEJtTkRnbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03ZA--';
	var woeidUrl = "http://where.yahooapis.com/v1/places.q('" + position + "')?appid=" + myYahooAppID;

	$.getJSON(woeidUrl, function(data) {
		if (data.error != null) {
			console.error('WEATHER: Cannot get the woeid');
		} else {
			woeid = data.places.place[0].woeid;
			console.log('WEATHER: woeid -->' + woeid);
			getWeather(woeid);
		}
	});

	function getWeather(placeWoeid) {
		var weatherUrl = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=" + placeWoeid;
        var tz = getCookie('timezone');
        if(tz.indexOf('America') >= 0 ) {
            weatherUrl += " and u='f'";
            $('#temp_unit').html("F");
        }
        else {
            weatherUrl += " and u='c'";
            $('#temp_unit').html("C");
        }
        weatherUrl +=  "&format=json";

		if (weatherUpdated == 0) {
			$.getJSON(weatherUrl, function(data) {
				var count = data.query.count;
				if(count == 1){
					iconCode = data.query.results.channel.item.condition.code;
					iconText = data.query.results.channel.item.condition.text;
					temperature = data.query.results.channel.item.condition.temp + '°';
					humidity = data.query.results.channel.atmosphere.humidity + '%';
					speed = (data.query.results.channel.wind.speed) + 'mph';

					$('#weather-icon').attr('src', 'http://l.yimg.com/a/i/us/we/52/' + iconCode + '.gif');
					$('#weather-icon').attr('title', iconText);
					$('#weather > h1').html(temperature);
					$('#humidity').html(humidity);
					$('#speed').html(speed);
					weatherUpdated = 1;
					console.log('WEATHER: ' + iconText + ' ' + temperature + ' ' + humidity + ' ' + speed);
				}
				checkUpdateWeatherStatus();
			});
		}
	}
}

function checkUpdateWeatherStatus() {

	if (weatherUpdated == 1) {
		console.log('WEATHER: get yahoo weather forecast successfully.');
		checkTimes = 0;
	} else {
		checkTimes++;
		console.error('WEATHER: ' + checkTimes + ' times failed to get yahoo weather forecast.');
		if (checkTimes < tryTimes) {
			updateWeather();
		}
	}
}

//// update weather every 1 hour
//setInterval(updateWeather(), 3600*1000);