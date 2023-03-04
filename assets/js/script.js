var openWeatherAPIKey = "357d278b4dc1d31d59f16e3afe69a945";
var city = "Durham";
var citySearchResultsEl = $("#city-search-results");
var recentSearchResultsEl = $("#recent-search-results");

var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=35.996653&lon=-78.9018053&appid=" + openWeatherAPIKey + "&units=imperial";
var currentUrl = "https://api.openweathermap.org/data/2.5/weather?lat=35.996653&lon=-78.9018053&appid=" + openWeatherAPIKey + "&units=imperial";

function getCity() {
    console.log("Function to get Latitude and Longitude")
    fetch(
        // Explain each parameter in comments below.
        'https://api.openweathermap.org/geo/1.0/direct?q=Durham&limit=5&appid=' + openWeatherAPIKey
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
          searchDisplay(data)
          storeCity(data)
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
    $("#city-name-btn").click(getCity)
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