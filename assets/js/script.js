var openWeatherAPIKey = "357d278b4dc1d31d59f16e3afe69a945";
var city = "Durham";

var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=35.996653&lon=-78.9018053&appid=" + openWeatherAPIKey + "&units=imperial";

function getLatLon() {
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
        });

}

function initListeners() {
    console.log("Function to initialize the listeners")
    $("#city-search-form").submit(function(event){
        event.preventDefault();
        console.log("submitted form")
    }
    
    )
    $("#city-name-btn").click(getLatLon)
}

fetch(queryURL)
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
    // loadcities();
});