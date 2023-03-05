var openWeatherAPIKey = "357d278b4dc1d31d59f16e3afe69a945";
var city = "Durham";
var citySearchResultsEl = $("#city-search-results");
var recentSearchResultsEl = $("#recent-search-results");
var forecastContainerEl = $("#forecast-container");

var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=35.996653&lon=-78.9018053&appid=" + openWeatherAPIKey + "&units=imperial";
var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat=35.996653&lon=-78.9018053&appid=" + openWeatherAPIKey + "&units=imperial";

function getCity(event) {
    event.preventDefault();
    console.log("Function to get Latitude and Longitude")
    var cityName = $("#city-name").val();
    console.log(cityName)
    fetch(
        // Explain each parameter in comments below.
        'https://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit=5&appid=' + openWeatherAPIKey
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          console.log("City: " + data[0].name)
          console.log("State: " + data[0].state)
          console.log("Country: " + data[0].country)
          console.log("latitute: " + data[0].lat)
          console.log("longitude: " + data[0].lon)

          var cityLat = data[0].lat
          var cityLon = data[0].lon

          var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";
          var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";

          searchDisplay(data)
          storeCity(data)
          currentWeather(currentUrl)
          forecastWeather(forecastURL)
        });

}

function currentWeather(currentUrl) {
    fetch(currentUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          console.log(data.main.temp);
          console.log(data.main.humidity);
          console.log(data.wind.speed);
          console.log(data.weather[0].icon)
          var now = dayjs().format('MMMM D, YYYY')
          console.log(now)
          $("#city-details-header").text(data.name + ' (' + now + ')')
          $("#current-city-temp").text("Temperature: " + data.main.temp + "\u00B0F")
          $("#current-city-wind").text("Wind Speed: " + data.wind.speed + " MPH")
          $("#current-city-humid").text("Humidity: " + data.main.humidity + "%")
          
          iconURL = 'http://openweathermap.org/img/w/'+ data.weather[0].icon +'.png'
          console.log(iconURL)

          var iconImage = $("<img>").attr("src", iconURL);
          $("#city-details-header").append(iconImage)

        });

        
}

function forecastWeather(forecastUrl) {
    fetch(forecastUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          var dataList = data.list
          console.log(dataList)
          console.log(dataList[0])

          for(var i=0;i<dataList.length; i++) {
            var date = dataList[i].dt_txt.split(" ")[0]
            var time = dataList[i].dt_txt.split(" ")[1]

            var dateFormatted = dayjs(date).format('MMMM D, YYYY')
            console.log(dateFormatted)

            if (time === '15:00:00' && dateFormatted !== dayjs()) {
                console.log(dateFormatted)
                console.log(dataList[i])

                var dayForecastEl = $('<section>'); 
                // creates an id for the time schedule elements that is unique to what hour it is.  
                dayForecastEl.attr('id', 'day-' + dateFormatted)

                var dateForecastEl = $('<p>');
                dateForecastEl.attr('id', 'day-date-' + dateFormatted) 
                dateForecastEl.text(dateFormatted)

                var iconForecastEl = $('<p>');
                iconForecastEl.attr('id', 'day-icon-' + dateFormatted) 

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
                dayForecastEl.append(tempForecastEl);
                dayForecastEl.append(windForecastEl);
                dayForecastEl.append(humForecastEl);

                forecastContainerEl.append(dayForecastEl);

                // $("#city-details-header").text(data.name + ' (' + now + ')')
                // $("#current-city-temp").text("Temperature: " + data.main.temp + "\u00B0F")
                // $("#current-city-wind").text("Wind Speed: " + data.wind.speed + " MPH")
                // $("#current-city-humid").text("Humidity: " + data.main.humidity + "%")
            }

          }
        });
    
}

function searchDisplay(data) {
    console.log("display the search results")
    console.log(data)
    console.log(citySearchResultsEl)
    var citySearchHtml = "";
    for (var i=0;i<data.length;i++){
        citySearchHtml += '<article>';
        citySearchHtml += '<button class="city" id="city-'+i+'-btn">'+data[i].name+', '+data[i].state+'</button>';
        citySearchHtml += '</article>';
    }
    citySearchResultsEl.html(citySearchHtml)
}

function storeCity(data){
    console.log("function to store data about the city")
    console.log(data)
    var singleCity = data[0]
    localStorage.setItem( "cityData", JSON.stringify(singleCity) );
}

function loadCities() {
    cityData = JSON.parse(localStorage.getItem("cityData"));
    if (!cityData){
        cityData = [];   
    }
    console.log("load cities", cityData);
    updateCityList(cityData);
}

function updateCityList(data){
    console.log("update city list");
    console.log(data)
    console.log(recentSearchResultsEl)
}


function initListeners() {
    console.log("Function to initialize the listeners")
    $("#city-search-form").submit(function(event){
        event.preventDefault();
        console.log("submitted form")
    }
    
    )
    $("#city-name-btn").on("click",getCity);
}

fetch(forecastURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log(data.city);
        console.log("Today's Temp: "+data.list[0].main.temp);
        console.log("Tomorrow's Temp: "+data.list[7].main.temp);
        console.log("Today's Humidity: "+data.list[0].main.humidity);
        console.log("Tomorrow's Humidity: "+data.list[7].main.humidity);
        console.log("Today's Weather: "+data.list[0].weather[0].main + " " + data.list[0].weather[0].description);
        console.log("Tomorrow's Weather: "+data.list[7].weather[0].main + " " + data.list[7].weather[0].description);
        console.log("Today's Weather: "+data.list[0].wind.speed + " with gusts up to " + data.list[0].wind.gust);
        console.log("Tomorrow's Weather: "+data.list[7].wind.speed + " with gusts up to " + data.list[7].wind.gust);

    });

$(function(){
    console.log("init");
    initListeners();
    loadCities();
});