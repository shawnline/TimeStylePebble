/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }
	
	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;
	
	  // For Android (WebView-based) pkjs, print stacktrace for uncaught errors:
	  if (typeof window !== 'undefined' && window.addEventListener) {
	    window.addEventListener('error', function(event) {
	      if (event.error && event.error.stack) {
	        console.error('' + event.error + '\n' + event.error.stack);
	      }
	    });
	  }
	
	})(Pebble);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	
	var weather = __webpack_require__(3);
	
	var CONFIG_VERSION = 8;
	// var BASE_CONFIG_URL = 'http://localhost:4000/';
	var BASE_CONFIG_URL = 'http://freakified.github.io/TimeStylePebble/';
	
	// Listen for when the watchface is opened
	Pebble.addEventListener('ready',
	  function(e) {
	    console.log('JS component is now READY');
	
	    // if it has never been started, set the weather to disabled
	    // this is because the weather defaults to "off"
	    if(window.localStorage.getItem('disable_weather') === null) {
	      window.localStorage.setItem('disable_weather', 'yes');
	    }
	
	    console.log('the wdisabled value is: "' + window.localStorage.getItem('disable_weather') + '"');
	    // if applicable, get the weather data
	    if(window.localStorage.getItem('disable_weather') != 'yes') {
	      weather.updateWeather();
	    }
	  }
	);
	
	// Listen for incoming messages
	// when one is received, we simply assume that it is a request for new weather data
	Pebble.addEventListener('appmessage',
	  function(msg) {
	    console.log('Recieved message: ' + JSON.stringify(msg.payload));
	
	    // in the case of recieving this, we assume the watch does, in fact, need weather data
	    window.localStorage.setItem('disable_weather', 'no');
	    weather.updateWeather();
	  }
	);
	
	Pebble.addEventListener('showConfiguration', function(e) {
	  var bwConfigURL    = BASE_CONFIG_URL + 'config_bw.html';
	  var colorConfigURL = BASE_CONFIG_URL + 'config_color.html';
	  var roundConfigURL = BASE_CONFIG_URL + 'config_color_round.html';
	  var dioriteConfigURL = BASE_CONFIG_URL + 'config_diorite.html';
	
	  var versionString = '?appversion=' + CONFIG_VERSION;
	
	  if(Pebble.getActiveWatchInfo) {
	    try {
	      watch = Pebble.getActiveWatchInfo();
	    } catch(err) {
	      watch = {
	        platform: "basalt"
	      };
	    }
	  } else {
	    watch = {
	      platform: "aplite"
	    };
	  }
	
	  if(watch.platform == "aplite"){
	    Pebble.openURL(bwConfigURL + versionString);
	  } else if(watch.platform == "chalk") {
	    Pebble.openURL(roundConfigURL + versionString);
	  } else if(watch.platform == "diorite") {
	    Pebble.openURL(dioriteConfigURL + versionString);
	  } else {
	    Pebble.openURL(colorConfigURL + versionString);
	  }
	});
	
	Pebble.addEventListener('webviewclosed', function(e) {
	  var configData = decodeURIComponent(e.response);
	
	  if(configData) {
	    configData = JSON.parse(decodeURIComponent(e.response));
	
	    console.log("Config data recieved!" + JSON.stringify(configData));
	
	    // prepare a structure to hold everything we'll send to the watch
	    var dict = {};
	
	    // color settings
	    if(configData.color_bg) {
	      dict.SettingColorBG = parseInt(configData.color_bg, 16);
	    }
	
	    if(configData.color_sidebar) {
	      dict.SettingColorSidebar = parseInt(configData.color_sidebar, 16);
	    }
	
	    if(configData.color_time) {
	      dict.SettingColorTime = parseInt(configData.color_time, 16);
	    }
	
	    if(configData.sidebar_text_color) {
	      dict.SettingSidebarTextColor = parseInt(configData.sidebar_text_color, 16);
	    }
	
	    // general options
	    if(configData.language_id !== undefined) {
	      dict.SettingLanguageID = configData.language_id;
	    }
	
	    if(configData.leading_zero_setting) {
	      if(configData.leading_zero_setting == 'yes') {
	        dict.SettingShowLeadingZero = 1;
	      } else {
	        dict.SettingShowLeadingZero = 0;
	      }
	    }
	
	    if(configData.clock_font_setting) {
	      if(configData.clock_font_setting == 'default') {
	        dict.SettingClockFontId = 0;
	      } else if(configData.clock_font_setting == 'leco') {
	        dict.SettingClockFontId = 1;
	      } else if(configData.clock_font_setting == 'bold') {
	        dict.SettingClockFontId = 2;
	      } else if(configData.clock_font_setting == 'bold-h') {
	        dict.SettingClockFontId = 3;
	      } else if(configData.clock_font_setting == 'bold-m') {
	        dict.SettingClockFontId = 4;
	      }
	    }
	
	    // bluetooth settings
	    if(configData.disconnect_icon_setting) {
	      if(configData.disconnect_icon_setting == 'yes') {
	        dict.SettingDisconnectIcon = 1;
	      } else {
	        dict.SettingDisconnectIcon = 0;
	      }
	    }
	
	    if(configData.bluetooth_vibe_setting) {
	      if(configData.bluetooth_vibe_setting == 'yes') {
	        dict.SettingBluetoothVibe = 1;
	      } else {
	        dict.SettingBluetoothVibe = 0;
	      }
	    }
	
	    // notification settings
	    if(configData.hourly_vibe_setting) {
	      if(configData.hourly_vibe_setting == 'yes') {
	        dict.SettingHourlyVibe = 1;
	      } else if (configData.hourly_vibe_setting == 'half') {
	        dict.SettingHourlyVibe = 2;
	      } else {
	        dict.SettingHourlyVibe = 0;
	      }
	    }
	
	    // sidebar settings
	    dict.SettingWidget0ID = configData.widget_0_id;
	    dict.SettingWidget1ID = configData.widget_1_id;
	    dict.SettingWidget2ID = configData.widget_2_id;
	
	    if(configData.sidebar_position) {
	      if(configData.sidebar_position == 'right') {
	        dict.SettingSidebarOnLeft = 0;
	      } else {
	        dict.SettingSidebarOnLeft = 1;
	      }
	    }
	
	    if(configData.use_large_sidebar_font_setting) {
	      if(configData.use_large_sidebar_font_setting == 'yes') {
	        dict.SettingUseLargeFonts = 1;
	      } else {
	        dict.SettingUseLargeFonts = 0;
	      }
	    }
	
	    // weather widget settings
	    if(configData.units) {
	      if(configData.units == 'c') {
	        dict.SettingUseMetric = 1;
	      } else {
	        dict.SettingUseMetric = 0;
	      }
	    }
	
	    // weather location/source configs are not the watch's concern
	
	    if(configData.weather_loc !== undefined) {
	      window.localStorage.setItem('weather_loc', configData.weather_loc);
	      window.localStorage.setItem('weather_loc_lat', configData.weather_loc_lat);
	      window.localStorage.setItem('weather_loc_lng', configData.weather_loc_lng);
	    }
	
	    if(configData.weather_datasource) {
	      window.localStorage.setItem('weather_datasource', configData.weather_datasource);
	      window.localStorage.setItem('weather_api_key', configData.weather_api_key);
	    }
	
	    // battery widget settings
	    if(configData.battery_meter_setting) {
	      if(configData.battery_meter_setting == 'icon-and-percent') {
	        dict.SettingShowBatteryPct = 1;
	      } else if(configData.battery_meter_setting == 'icon-only') {
	        dict.SettingShowBatteryPct = 0;
	      }
	    }
	
	    if(configData.autobattery_setting) {
	      if(configData.autobattery_setting == 'on') {
	        dict.SettingDisableAutobattery = 0;
	      } else if(configData.autobattery_setting == 'off') {
	        dict.SettingDisableAutobattery = 1;
	      }
	    }
	
	    if(configData.altclock_name) {
	      dict.SettingAltClockName = configData.altclock_name;
	    }
	
	    if(configData.altclock_offset !== null) {
	      dict.SettingAltClockOffset = parseInt(configData.altclock_offset, 10);
	    }
	
	    if(configData.decimal_separator) {
	      dict.SettingDecimalSep = configData.decimal_separator;
	    }
	
	    if(configData.health_use_distance) {
	      if(configData.health_use_distance == 'yes') {
	        dict.SettingHealthUseDistance = 1;
	      } else {
	        dict.SettingHealthUseDistance = 0;
	      }
	    }
	
	    // heath settings
	    if(configData.health_use_restful_sleep) {
	      if(configData.health_use_restful_sleep == 'yes') {
	        dict.SettingHealthUseRestfulSleep = 1;
	      } else {
	        dict.SettingHealthUseRestfulSleep = 0;
	      }
	    }
	
	    // determine whether or not the weather checking should be enabled
	    var disableWeather;
	
	    var widgetIDs = [configData.widget_0_id, configData.widget_1_id, configData.widget_2_id];
	
	    // if there is either a current conditions or a today's forecast widget, enable the weather
	    if(widgetIDs.indexOf(7) != -1 || widgetIDs.indexOf(8) != -1) {
	        disableWeather = 'no';
	    } else {
	        disableWeather = 'yes';
	    }
	
	    window.localStorage.setItem('disable_weather', disableWeather);
	
	    var enableForecast;
	
	    if(widgetIDs.indexOf(8) != -1) {
	      enableForecast = 'yes';
	    }
	
	    window.localStorage.setItem('enable_forecast', enableForecast);
	
	    console.log('Preparing message: ', JSON.stringify(dict));
	
	    // Send settings to Pebble watchapp
	    Pebble.sendAppMessage(dict, function(){
	      console.log('Sent config data to Pebble, now trying to get weather');
	
	      // after sending config data, force a weather refresh in case that changed
	      weather.updateWeather(true);
	    }, function() {
	        console.log('Failed to send config data!');
	    });
	  } else {
	    console.log("No settings changed!");
	  }
	
	});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* general utility stuff related to weather */
	
	var weatherProviders = {
	  'owm'          : __webpack_require__(4),
	  // 'forecast'     : require('weather_forecast'),
	  'wunderground' : __webpack_require__(6)
	};
	
	var DEFAULT_WEATHER_PROVIDER = 'owm';
	
	// get new forecasts if 3 hours have elapsed
	var FORECAST_MAX_AGE = 3 * 60 * 60 * 1000;
	var MAX_FAILURES = 3;
	var currentFailures = 0;
	
	// icon codes for sending weather icons to pebble
	var WeatherIcons = {
	  CLEAR_DAY           : 0,
	  CLEAR_NIGHT         : 1,
	  CLOUDY_DAY          : 2,
	  HEAVY_RAIN          : 3,
	  HEAVY_SNOW          : 4,
	  LIGHT_RAIN          : 5,
	  LIGHT_SNOW          : 6,
	  PARTLY_CLOUDY_NIGHT : 7,
	  PARTLY_CLOUDY       : 8,
	  RAINING_AND_SNOWING : 9,
	  THUNDERSTORM        : 10,
	  WEATHER_GENERIC     : 11
	};
	
	
	function getCurrentWeatherProvider() {
	  var currentWeatherProvider = window.localStorage.getItem('weather_datasource');
	
	  if(weatherProviders[currentWeatherProvider] !== undefined ) {
	    return weatherProviders[currentWeatherProvider];
	  } else {
	    return weatherProviders[DEFAULT_WEATHER_PROVIDER];
	  }
	}
	
	function updateWeather(forceUpdate) {
	  var weatherDisabled = window.localStorage.getItem('disable_weather');
	
	  console.log("Get weather function called! DisableWeather is '" + weatherDisabled + "'");
	
	  // if weather is not disabled...
	  if(weatherDisabled !== "yes") {
	    // in case "disable_weather" is empty or something weird, set it to "no"
	    // since we already know it's not "yes"
	    window.localStorage.setItem('disable_weather', 'no');
	
	    var weatherLoc = window.localStorage.getItem('weather_loc');
	    var storedLat = window.localStorage.getItem('weather_loc_lat');
	    var storedLng = window.localStorage.getItem('weather_loc_lng');
	
	    // console.log("Stored lat: " +  storedLat + ", stored lng: " + storedLng);
	
	    if(weatherLoc) { // do we have a stored location?
	      // if so, we should check if we have valid LAT and LNG coords
	      hasLocationCoords = (storedLat != undefined && storedLng != undefined)
	                       && (storedLat != '' && storedLng != '');
	      if(hasLocationCoords) { // do we have valid stored coordinates?
	        // if we have valid coords, use them
	        var pos = {
	                    coords : {
	                      latitude : storedLat,
	                      longitude : storedLng
	                    }
	                  };
	
	        getCurrentWeatherProvider().getWeatherFromCoords(pos);
	
	        if(forceUpdate || isForecastNeeded()) {
	          getCurrentWeatherProvider().getForecastFromCoords(pos);
	        }
	      } else {
	        // otherwise, use the stored string (legacy, or google was blocked from running)
	        getCurrentWeatherProvider().getWeather(weatherLoc);
	
	        if(forceUpdate || isForecastNeeded()) {
	          getCurrentWeatherProvider().getForecast(weatherLoc);
	        }
	      }
	    } else {
	      // if we don't have a stored location, get the GPS location
	      getLocation();
	    }
	  }
	}
	
	function getLocation() {
	  navigator.geolocation.getCurrentPosition(
	    locationSuccess,
	    locationError,
	    {timeout: 15000, maximumAge: 60000}
	  );
	}
	
	function locationError(err) {
	  console.log('location error on the JS side! Failure #' + currentFailures);
	  //if we fail, try using the cached location
	  if(currentFailures <= MAX_FAILURES) {
	    // reset cache time
	    window.localStorage.setItem('weather_loc_cache_time', (new Date().getTime() / 1000));
	
	    // try again
	    updateWeather();
	    currentFailures++;
	  } else {
	    // until we get too many failures, at which point give up
	    currentFailures = 0;
	  }
	}
	
	function locationSuccess(pos) {
	  getCurrentWeatherProvider().getWeatherFromCoords(pos);
	
	  if(isForecastNeeded()) {
	    setTimeout(function() { getCurrentWeatherProvider().getForecastFromCoords(pos); }, 5000);
	  }
	}
	
	function isForecastNeeded() {
	  var enableForecast = window.localStorage.getItem('enable_forecast');
	  var lastForecastTime = window.localStorage.getItem('last_forecast_time');
	  var forecastAge = Date.now() - lastForecastTime;
	
	  console.log("Forecast requested! Age is " + forecastAge);
	
	  if(enableForecast === 'yes' && forecastAge > FORECAST_MAX_AGE) {
	    return true;
	  } else {
	    return false;
	  }
	}
	
	function sendWeatherToPebble(dictionary) {
	  // Send to Pebble
	  Pebble.sendAppMessage(dictionary,
	    function(e) {
	      console.log('Weather info sent to Pebble successfully!');
	    },
	    function(e) {
	      // if we fail, wait a couple seconds, then try again
	      if(currentFailures < failureRetryAmount) {
	        // call it again somewhere between 3 and 10 seconds
	        setTimeout(updateWeather, Math.floor(Math.random() * 10000) + 3000);
	
	        currentFailures++;
	      } else {
	        currentFailures = 0;
	      }
	
	      console.log('Error sending weather info to Pebble! Count: #' + currentFailures);
	    }
	  );
	}
	
	var xhrRequest = function (url, type, callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.onload = function () {
	    callback(this.responseText);
	  };
	  xhr.open(type, url);
	  xhr.send();
	};
	
	// the individual weather providers need access to the weather icons
	module.exports.icons = WeatherIcons;
	
	// utility functions common to all weather providers
	module.exports.xhrRequest = xhrRequest;
	module.exports.sendWeatherToPebble = sendWeatherToPebble;
	
	// called by app.js
	// updates the weather if needed, respecting all provider settings in localStorage
	module.exports.updateWeather = updateWeather;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	// this contains our offical OWM weather key, hidden from prying eyes
	var secrets = __webpack_require__(5);
	var weatherCommon = __webpack_require__(3);
	
	// "public" functions
	
	module.exports.getWeather = getWeather;
	module.exports.getWeatherFromCoords = getWeatherFromCoords;
	module.exports.getForecast = getForecast;
	module.exports.getForecastFromCoords = getForecastFromCoords;
	
	function getWeather(weatherLoc) {
	  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' +
	      encodeURIComponent(weatherLoc) + '&units=metric&appid=' + secrets.OWM_APP_ID;
	
	  getAndSendCurrentWeather(url);
	}
	
	function getWeatherFromCoords(pos) {
	  // Construct URL
	  var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
	      pos.coords.latitude + '&lon=' + pos.coords.longitude + '&units=metric&appid=' + secrets.OWM_APP_ID;
	  console.log(url);
	
	  getAndSendCurrentWeather(url);
	}
	
	function getForecast(weatherLoc) {
	  var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' +
	      encodeURIComponent(weatherLoc) + '&cnt=8&units=metric&appid=' + secrets.OWM_APP_ID;
	
	  getAndSendWeatherForecast(forecastURL);
	}
	
	function getForecastFromCoords(pos) {
	  var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' +
	      pos.coords.latitude + '&lon=' + pos.coords.longitude + '&cnt=8&units=metric&appid=' + secrets.OWM_APP_ID;
	
	  getAndSendWeatherForecast(forecastURL);
	}
	
	// "private" functions
	
	// accepts an openweathermap url, gets weather data from it, and sends it to the watch
	function getAndSendCurrentWeather(url) {
	  weatherCommon.xhrRequest(url, 'GET',
	    function(responseText) {
	      // responseText contains a JSON object with weather info
	      var json = JSON.parse(responseText);
	
	      if(json.cod == "200") {
	        var temperature = Math.round(json.main.temp);
	        console.log('Temperature is ' + temperature);
	
	        // Conditions
	        var conditionCode = json.weather[0].id;
	        console.log('Condition code is ' + conditionCode);
	
	        // night state
	        var isNight = (json.weather[0].icon.slice(-1) == 'n') ? 1 : 0;
	
	        var iconToLoad = getIconForConditionCode(conditionCode, isNight);
	
	        // Assemble dictionary using our keys
	        var dictionary = {
	          'WeatherTemperature': temperature,
	          'WeatherCondition': iconToLoad
	        };
	
	        console.log(JSON.stringify(dictionary));
	
	        weatherCommon.sendWeatherToPebble(dictionary);
	      }
	  });
	}
	
	function getAndSendWeatherForecast(url) {
	  console.log(url);
	  weatherCommon.xhrRequest(url, 'GET',
	    function(responseText) {
	      // responseText contains a JSON object with weather info
	      var json = JSON.parse(responseText);
	
	      if(json.cod == "200") {
	        var forecast = extractFakeDailyForecast(json);
	
	        console.log('Forecast high/low temps are ' + forecast.highTemp + '/' + forecast.lowTemp);
	
	        // Conditions
	        var conditionCode = forecast.condition;
	        console.log('Forecast condition is ' + conditionCode);
	
	        var iconToLoad = getIconForConditionCode(conditionCode, false);
	
	        // Assemble dictionary using our keys
	        var dictionary = {
	          'WeatherForecastCondition': iconToLoad,
	          'WeatherForecastHighTemp': forecast.highTemp,
	          'WeatherForecastLowTemp': forecast.lowTemp
	        };
	
	        console.log(JSON.stringify(dictionary));
	
	        weatherCommon.sendWeatherToPebble(dictionary);
	    }
	  });
	}
	
	function getIconForConditionCode(conditionCode, isNight) {
	  var generalCondition = Math.floor(conditionCode / 100);
	
	  // determine the correct icon
	  switch(generalCondition) {
	    case 2: //thunderstorm
	      iconToLoad = weatherCommon.icons.THUNDERSTORM;
	      break;
	    case 3: //drizzle
	      iconToLoad = weatherCommon.icons.LIGHT_RAIN;
	      break;
	    case 5: //rain
	      if(conditionCode == 500) {
	        iconToLoad = weatherCommon.icons.LIGHT_RAIN;
	      } else if(conditionCode < 505) {
	        iconToLoad = weatherCommon.icons.HEAVY_RAIN;
	      } else if(conditionCode == 511) {
	        iconToLoad = weatherCommon.icons.RAINING_AND_SNOWING;
	      } else {
	        iconToLoad = weatherCommon.icons.LIGHT_RAIN;
	      }
	      break;
	    case 6: //snow
	      if(conditionCode == 600 || conditionCode == 620) {
	        iconToLoad = weatherCommon.icons.LIGHT_SNOW;
	      } else if(conditionCode > 610 && conditionCode < 620) {
	        iconToLoad = weatherCommon.icons.RAINING_AND_SNOWING;
	      } else {
	        iconToLoad = weatherCommon.icons.HEAVY_SNOW;
	      }
	      break;
	    case 7: // fog, dust, etc
	      iconToLoad = weatherCommon.icons.CLOUDY_DAY;
	      break;
	    case 8: // clouds
	      if(conditionCode == 800) {
	        iconToLoad = (!isNight) ? weatherCommon.icons.CLEAR_DAY : weatherCommon.icons.CLEAR_NIGHT;
	      } else if(conditionCode < 803) {
	        iconToLoad = (!isNight) ? weatherCommon.icons.PARTLY_CLOUDY : weatherCommon.icons.PARTLY_CLOUDY_NIGHT;
	      } else {
	        iconToLoad = weatherCommon.icons.CLOUDY_DAY;
	      }
	      break;
	    default:
	      iconToLoad = weatherCommon.icons.WEATHER_GENERIC;
	      break;
	  }
	
	  return iconToLoad;
	}
	
	/*
	 Attempts to approximate a daily forecast by interpolating the next
	 24 hours worth of 3 hour forecasts :-O
	*/
	function extractFakeDailyForecast(json) {
	  var todaysForecast = {};
	
	 // Set the high and low temp to the first interval's values. Avoids returning an invalid number as the temperature.
	  todaysForecast.highTemp = json.list[0].main.temp_max;
	  todaysForecast.lowTemp  = json.list[0].main.temp_min;
	
	  //Iterates from 1 instead of 0 because we already stored those values
	  for(var i = 1; i < json.list.length; i++) {
	    if(todaysForecast.highTemp < json.list[i].main.temp_max) {
	      todaysForecast.highTemp = json.list[i].main.temp_max;
	    }
	
	    if(todaysForecast.lowTemp > json.list[i].main.temp_min) {
	      todaysForecast.lowTemp = json.list[i].main.temp_min;
	    }
	  }
	
	  // we can't really "average" conditions, so we'll just cheat and use...one of them :-O
	  todaysForecast.condition = json.list[3].weather[0].id;
	
	  return todaysForecast;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	var OWM_APP_ID = '541c94ee61203cf998e04275a47d91f0';
	
	module.exports.OWM_APP_ID = OWM_APP_ID;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var weatherCommon = __webpack_require__(3);
	
	// "public" functions
	
	module.exports.getWeather = getWeather;
	module.exports.getWeatherFromCoords = getWeatherFromCoords;
	module.exports.getForecast = getForecast;
	module.exports.getForecastFromCoords = getForecastFromCoords;
	
	function getWeather(weatherLoc) {
	  var apiKey = window.localStorage.getItem('weather_api_key');
	
	  var url = 'http://api.wunderground.com/api/' + apiKey +
	            '/conditions/q/' + encodeURIComponent(weatherLoc) + '.json';
	
	  getAndSendCurrentWeather(url);
	}
	
	function getWeatherFromCoords(pos) {
	  var apiKey = window.localStorage.getItem('weather_api_key');
	
	  // Construct URL
	  var url = 'http://api.wunderground.com/api/' + apiKey +
	            '/conditions/q/' + pos.coords.latitude + ',' + pos.coords.longitude + '.json';
	
	  getAndSendCurrentWeather(url);
	}
	
	function getForecast(weatherLoc) {
	  var apiKey = window.localStorage.getItem('weather_api_key');
	
	  var forecastURL = 'http://api.wunderground.com/api/' + apiKey +
	            '/forecast/q/' + encodeURIComponent(weatherLoc) + '.json';
	
	  getAndSendWeatherForecast(forecastURL);
	}
	
	function getForecastFromCoords(pos) {
	  var apiKey = window.localStorage.getItem('weather_api_key');
	
	  var forecastURL = 'http://api.wunderground.com/api/' + apiKey +
	            '/forecast/q/' + pos.coords.latitude + ',' + pos.coords.longitude + '.json';
	
	  getAndSendWeatherForecast(forecastURL);
	}
	
	// "private" functions
	
	// accepts a wunderground conditions url, gets weather data from it, and sends it to the watch
	function getAndSendCurrentWeather(url) {
	  weatherCommon.xhrRequest(url, 'GET',
	    function(responseText) {
	      // responseText contains a JSON object with weather info
	      var json = JSON.parse(responseText);
	
	      if(json.response.features.conditions == 1) {
	        var temperature = Math.round(json.current_observation.temp_c);
	        console.log('Temperature is ' + temperature);
	
	        // Conditions
	        var conditionCode = json.current_observation.icon;
	        console.log('Condition icon is ' + conditionCode);
	
	        // night state
	        var isNight = false;
	
	        if(json.current_observation.icon_url.indexOf('nt_') != -1) {
	          isNight = true;
	        }
	
	        var iconToLoad = getIconForConditionCode(conditionCode, isNight);
	        console.log('were loading this icon:' + iconToLoad);
	
	        // Assemble dictionary using our keys
	        var dictionary = {
	          'WeatherTemperature': temperature,
	          'WeatherCondition': iconToLoad
	        };
	
	        console.log(JSON.stringify(dictionary));
	
	        weatherCommon.sendWeatherToPebble(dictionary);
	      }
	  });
	}
	
	function getAndSendWeatherForecast(url) {
	  console.log(url);
	  weatherCommon.xhrRequest(url, 'GET',
	    function(responseText) {
	      // responseText contains a JSON object with weather info
	      var json = JSON.parse(responseText);
	
	      if(json.response.features.forecast == 1) {
	        var todaysForecast = json.forecast.simpleforecast.forecastday[0];
	
	        var highTemp = parseInt(todaysForecast.high.celsius, 10);
	        var lowTemp = parseInt(todaysForecast.low.celsius, 10);
	
	        console.log('Forecast high/low temps are ' + highTemp + '/' + lowTemp);
	
	        // Conditions
	        var conditionCode = todaysForecast.icon;
	        console.log('Forecast icon is ' + conditionCode);
	
	        var iconToLoad = getIconForConditionCode(conditionCode, false);
	
	        // Assemble dictionary using our keys
	        var dictionary = {
	          'WeatherForecastCondition': iconToLoad,
	          'WeatherForecastHighTemp': highTemp,
	          'WeatherForecastLowTemp': lowTemp
	        };
	
	        console.log(JSON.stringify(dictionary));
	
	        weatherCommon.sendWeatherToPebble(dictionary);
	    }
	  });
	}
	
	function getIconForConditionCode(conditionCode, isNight) {
	
	  // determine the correct icon
	  switch(conditionCode) {
	    case 'chanceflurries':
	      iconToLoad = weatherCommon.icons.LIGHT_SNOW;
	      break;
	    case 'chancerain':
	      iconToLoad = weatherCommon.icons.LIGHT_RAIN;
	      break;
	    case 'chancesleet':
	      iconToLoad = weatherCommon.icons.RAINING_AND_SNOWING;
	      break;
	    case 'chancesnow':
	      iconToLoad = weatherCommon.icons.LIGHT_SNOW;
	      break;
	    case 'chancetstorms':
	      iconToLoad = weatherCommon.icons.THUNDERSTORM;
	      break;
	    case 'clear':
	      iconToLoad = (!isNight) ? weatherCommon.icons.CLEAR_DAY : weatherCommon.icons.CLEAR_NIGHT;
	      break;
	    case 'cloudy':
	      iconToLoad = weatherCommon.icons.CLOUDY_DAY;
	      break;
	    case 'flurries':
	      iconToLoad = weatherCommon.icons.LIGHT_SNOW;
	      break;
	    case 'fog':
	    case 'hazy':
	    case 'mostlycloudy':
	      iconToLoad = weatherCommon.icons.CLOUDY_DAY;
	      break;
	    case 'mostlysunny':
	      iconToLoad = (!isNight) ? weatherCommon.icons.CLEAR_DAY : weatherCommon.icons.CLEAR_NIGHT;
	      break;
	    case 'partlycloudy':
	      iconToLoad = (!isNight) ? weatherCommon.icons.PARTLY_CLOUDY : weatherCommon.icons.PARTLY_CLOUDY_NIGHT;
	      break;
	    case 'partlysunny':
	      iconToLoad = (!isNight) ? weatherCommon.icons.PARTLY_CLOUDY : weatherCommon.icons.PARTLY_CLOUDY_NIGHT;
	      break;
	    case 'sleet':
	      iconToLoad = weatherCommon.icons.RAINING_AND_SNOWING;
	      break;
	    case 'rain':
	      iconToLoad = weatherCommon.icons.HEAVY_RAIN;
	      break;
	    case 'snow':
	      iconToLoad = weatherCommon.icons.HEAVY_SNOW;
	      break;
	    case 'sunny':
	      iconToLoad = (!isNight) ? weatherCommon.icons.CLEAR_DAY : weatherCommon.icons.CLEAR_NIGHT;
	      break;
	    case 'tstorms':
	      iconToLoad = weatherCommon.icons.THUNDERSTORM;
	      break;
	    default:
	      iconToLoad = weatherCommon.icons.WEATHER_GENERIC;
	      console.log("Warning: No icon found for " + conditionCode);
	      break;
	  }
	
	  return iconToLoad;
	}


/***/ })
/******/ ]);
//# sourceMappingURL=pebble-js-app.js.map