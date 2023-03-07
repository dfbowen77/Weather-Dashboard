var openWeatherAPIKey = "357d278b4dc1d31d59f16e3afe69a945";
var cities = [];
var recentSearchResultsEl = $("#recent-search-results");
var forecastContainerEl = $("#forecast-container");

// This function is called to store the city data in LocalStorage
var storeCity = function() {

    console.log("save city data");
    localStorage.setItem( "cities", JSON.stringify(cities) );
}

// This function gets the city data from Local Storage, checks where it exists or not, then calls the updateCityList function
var loadCities = function() {
    cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities){
        cities = [];   
    }
    console.log("load cities", cities);
    updateCityList();
}

// This function uses unshift place the city that was most recently searched for at the top of the recent search list
var addCity = function(newCity){ 
    cities.unshift(newCity);
    console.log("add city", cities);
    updateCityList();
    storeCity();
}

// This function updates the city list and creates buttons that will allow the user to re-search recently searched cities 
var updateCityList = function(){
    console.log("update city list");

    var cityListHtml = "";
    for (var i=0; i<cities.length; i++){
        cityListHtml += '<article>';
        cityListHtml += '<button class="city-list-class bg-primary text-white m-1">'+cities[i].name+'</button>';
        cityListHtml += '</article>';
    }
    recentSearchResultsEl.html(cityListHtml);
    console.log(cities[0])
}

// This function get the text from the recently searched city buttons and passes the text to the getCity function 
$("#recent-search-results").on("click", "button", function(event){

    var recentCityName = $(this).text();
    console.log(recentCityName)

    getCity(recentCityName);

});

// The goal of this function is to get the latitude and longitude for a city, put them into URLs, and pass the URLs to the appropriate function
function getCity(cityName2) {
    // the next two lines are used to show the two sections of html after they were previously hidden.
    $("#city-details").show();
    $("#city-forecast").show();
    console.log(cityName2)
    var cityName = $("#city-name").val();
    console.log(cityName2)
    console.log(cityName)
    if (cityName != cityName2) {
        cityName = cityName2
    }
    fetch(
        // This function is used to 'fetch' data from the appropriate URL
        'https://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit=5&appid=' + openWeatherAPIKey
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {

          var cityLat = data[0].lat
          var cityLon = data[0].lon

          var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";
          var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";

        //   storeCity(cityName)
          currentWeather(currentUrl)
          forecastWeather(forecastURL)
        });

}

// This function uses the appropriate URL to gather current weather conditions for the selected city
function currentWeather(currentUrl) {
    fetch(currentUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var now = dayjs().format('MMMM D, YYYY')
          $("#city-details-header").text(data.name + ' (' + now + ')')
          $("#current-city-temp").text("Temperature: " + data.main.temp + "\u00B0F")
          $("#current-city-wind").text("Wind Speed: " + data.wind.speed + " MPH")
          $("#current-city-humid").text("Humidity: " + data.main.humidity + "%")
          
          iconURL = 'https://openweathermap.org/img/w/'+ data.weather[0].icon +'.png'

          var iconImage = $("<img>").attr("src", iconURL);
          $("#city-details-header").append(iconImage)

        });

        
}

// This function uses the appropriate URL to gather the 5-day forecast for the selected city
function forecastWeather(forecastUrl) {
    $("#forecast-container").empty();
    fetch(forecastUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {

          var dataList = data.list

          for(var i=0;i<dataList.length; i++) {
            var date = dataList[i].dt_txt.split(" ")[0]
            var time = dataList[i].dt_txt.split(" ")[1]

            var dateFormatted = dayjs(date).format('MMMM D, YYYY')
            var today = dayjs().format('MMMM D, YYYY')

            if (time === '12:00:00' && dateFormatted != today) {

                var dayForecastEl = $('<section>'); 
                // creates an id for the day forecast elements that is unique to the day.  
                dayForecastEl.attr('id', 'day-' + dateFormatted)
                // uses Bootstrap to format the 
                dayForecastEl.attr('class', 'col-sm bg-primary text-white m-1')

                var dateForecastEl = $('<p>');
                dateForecastEl.attr('id', 'day-date-' + dateFormatted) 
                dateForecastEl.text(dateFormatted)

                var iconForecastEl = $('<p>');
                iconURL = 'https://openweathermap.org/img/w/'+ dataList[i].weather[0].icon +'.png'
                var iconImage = $("<img>").attr("src", iconURL);
                iconForecastEl.attr('id', 'day-icon-' + dateFormatted) 
                iconForecastEl.append(iconImage)

                var tempForecastEl = $('<p>');
                tempForecastEl.attr('id', 'day-temp-' + dateFormatted)
                tempForecastEl.text("Temperature: " + dataList[i].main.temp + "\u00B0F")

                var windForecastEl = $('<p>');
                windForecastEl.attr('id', 'day-wind-' + dateFormatted) 
                windForecastEl.text("Wind Speed: " + dataList[i].wind.speed + " MPH")

                var humForecastEl = $('<p>');
                humForecastEl.attr('id', 'day-hum-' + dateFormatted) 
                humForecastEl.text("Humidity: " + dataList[i].main.humidity + "%")

                dayForecastEl.append(dateForecastEl);
                dayForecastEl.append(iconForecastEl);
                dayForecastEl.append(tempForecastEl);
                dayForecastEl.append(windForecastEl);
                dayForecastEl.append(humForecastEl);

                forecastContainerEl.append(dayForecastEl);
            }

          }
        });
    
}

// This function sets up the event listeners
function initListeners() {
    console.log("Function to initialize the listeners")
    $("#city-search-form").submit(function(event){
        event.preventDefault();
        console.log("submitted form")

        var newCityName = $("#city-name").val()

        var newCity = {
            name: newCityName
        }

        addCity(newCity)
        getCity(newCityName)
    }
    
    )
    
}

// This function is run when the page loads and ensures functions get run in the appropriate order
$(function(){
    console.log("init");
    initListeners();
    loadCities();

    var cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities)
     if (cities) {
        var lastCity = cities[0].name;  
        console.log("testing: " + lastCity)
        getCity(lastCity); 
        updateCityList();

    } else {
        // hides these sections of the HTML until they are needed
        $("#city-details").hide(); 
        $("#city-forecast").hide();
    }
});