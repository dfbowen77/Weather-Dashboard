var openWeatherAPIKey = "357d278b4dc1d31d59f16e3afe69a945";console
var cities = [];
var recentSearchResultsEl = $("#recent-search-results");
var forecastContainerEl = $("#forecast-container");

var storeCity = function() {

    console.log("save city data");
    localStorage.setItem( "cities", JSON.stringify(cities) );
}

var loadCities = function() {
    cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities){
        cities = [];   
    }
    console.log("load cities", cities);
    updateCityList();
}

var addCity = function(newCity){
    cities.unshift(newCity);
    console.log("add city", cities);
    updateCityList();
    storeCity();
}

var updateCityList = function(){
    console.log("update city list");

    var cityListHtml = "";
    for (var i=0; i<cities.length; i++){
        cityListHtml += '<article>';
        cityListHtml += '<p class="city-list-class">'+cities.name+'</p>';
        cityListHtml += '</article>';
    }
    recentSearchResultsEl.html(cityListHtml);
}

// function getCity(cityName) {
//     var cityName = $("#city-name").val();
//     fetch(
//         // Explain each parameter in comments below.
//         'https://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit=5&appid=' + openWeatherAPIKey
//       )
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {

//           var cityLat = data[0].lat
//           var cityLon = data[0].lon

//           var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";
//           var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+cityLat+"&lon="+cityLon+"&appid=" + openWeatherAPIKey + "&units=imperial";

//         //   storeCity(cityName)
//           currentWeather(currentUrl)
//           forecastWeather(forecastURL)
//         });

// }

// function currentWeather(currentUrl) {
//     fetch(currentUrl)
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {
//           var now = dayjs().format('MMMM D, YYYY')
//           $("#city-details-header").text(data.name + ' (' + now + ')')
//           $("#current-city-temp").text("Temperature: " + data.main.temp + "\u00B0F")
//           $("#current-city-wind").text("Wind Speed: " + data.wind.speed + " MPH")
//           $("#current-city-humid").text("Humidity: " + data.main.humidity + "%")
          
//           iconURL = 'http://openweathermap.org/img/w/'+ data.weather[0].icon +'.png'

//           var iconImage = $("<img>").attr("src", iconURL);
//           $("#city-details-header").append(iconImage)

//         });

        
// }

// function forecastWeather(forecastUrl) {
//     fetch(forecastUrl)
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {

//           var dataList = data.list

//           for(var i=0;i<dataList.length; i++) {
//             var date = dataList[i].dt_txt.split(" ")[0]
//             var time = dataList[i].dt_txt.split(" ")[1]

//             var dateFormatted = dayjs(date).format('MMMM D, YYYY')
//             var today = dayjs().format('MMMM D, YYYY')

//             if (time === '12:00:00' && dateFormatted != today) {

//                 var dayForecastEl = $('<section>'); 
//                 // creates an id for the time schedule elements that is unique to what hour it is.  
//                 dayForecastEl.attr('id', 'day-' + dateFormatted)

//                 var dateForecastEl = $('<p>');
//                 dateForecastEl.attr('id', 'day-date-' + dateFormatted) 
//                 dateForecastEl.text(dateFormatted)

//                 var iconForecastEl = $('<p>');
//                 iconURL = 'http://openweathermap.org/img/w/'+ dataList[i].weather[0].icon +'.png'
//                 var iconImage = $("<img>").attr("src", iconURL);
//                 iconForecastEl.attr('id', 'day-icon-' + dateFormatted) 
//                 iconForecastEl.append(iconImage)

//                 var tempForecastEl = $('<p>');
//                 tempForecastEl.attr('id', 'day-temp-' + dateFormatted)
//                 tempForecastEl.text("Temperature: " + dataList[i].main.temp + "\u00B0F")

//                 var windForecastEl = $('<p>');
//                 windForecastEl.attr('id', 'day-wind-' + dateFormatted) 
//                 windForecastEl.text("Wind Speed: " + dataList[i].wind.speed + " MPH")

//                 var humForecastEl = $('<p>');
//                 humForecastEl.attr('id', 'day-hum-' + dateFormatted) 
//                 humForecastEl.text("Humidity: " + dataList[i].main.humidity + "%")

//                 dayForecastEl.append(dateForecastEl);
//                 dayForecastEl.append(iconForecastEl);
//                 dayForecastEl.append(tempForecastEl);
//                 dayForecastEl.append(windForecastEl);
//                 dayForecastEl.append(humForecastEl);

//                 forecastContainerEl.append(dayForecastEl);
//             }

//           }
//         });
    
// }

// function loadCities() {
//     // id="recent-search-container"
//     cityData = JSON.parse(localStorage.getItem("cityData"));
//     if (!cityData){
//         cityData = [];   
//     }
//     console.log("load cities", cityData);
//     var citySearchList = $("<li>").text(cityData.name)
//     $("#recent-search-container").append(citySearchList)
//     updateCityList(cityData);
// }

$("#recent-search-container").on("click", "li", function(event){

    var recentCityName = $(this).text();
    console.log(recentCityName)

    getCity(recentCityName);

});

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
    }
    
    )
    // $("#city-name-btn").on("click",getCity);
}

$(function(){
    console.log("init");
    initListeners();
    // loadCities();
});