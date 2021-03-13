// https://www.weatherbit.io/api/weather-current
// weatherIcons from https://www.amcharts.com/

// ask for API Key
let apiQuestion = prompt('Before we start, please enter your API-Key first. You can get that for free on https://www.weatherbit.io/pricing or you can also just ask me.');

// select elements
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');

// app data
const weather = {};

weather.temperature = {
    unit: 'celsius'
}

// API key
const key = apiQuestion;
// const key = "YOUR_API_KEY";
// const key = "136b879bc20c44db92ab9fef62158cf8"; //weatherbit.io

// check if browser supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// show error when there is an issue with geolocation service
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// get weather from API provider
function getWeather(latitude, longitude) {
    let api = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${key}`;

    // console.log(api);

    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = data.data[0].app_temp;
            weather.description = data.data[0].weather.description;
            weather.iconId = data.data[0].weather.icon;
            weather.city = data.data[0].city_name;
            weather.country = data.data[0].country_code;
        })
        .then(function() {
            displayWeather();
        });
}

// display weather to UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

// change unit when user clicks on the temperature element
tempElement.addEventListener('click', function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});