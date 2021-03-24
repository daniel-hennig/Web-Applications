// https://www.weatherbit.io/api/weather-current

// ask for API Key
let apiQuestion = prompt('Before we start, please enter your API-Key first. You can get that for free on https://www.weatherbit.io/pricing or you can also just ask me.');

// select elements
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const feelslikeElement = document.querySelector('.feels-like');
const humidityElement = document.querySelector('.humidity');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
const container = document.querySelector('.container');
const appTitle = document.querySelector('.app-title p');

// app data
const weather = {};

weather.temperature = {
    unit: 'celsius'
}

// API key
const key = apiQuestion;
// const key = "YOUR_API_KEY";

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

    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = data.data[0].temp;
            weather.feelsTemp = data.data[0].app_temp;
            weather.relativeHumidity = Math.floor(data.data[0].rh);
            weather.description = data.data[0].weather.description;
            weather.iconId = data.data[0].weather.icon;
            weather.city = data.data[0].city_name;
            weather.country = data.data[0].country_code;
        })
        .then(function() {
            displayWeather();
        });
}

// set the right background to UI regarding to day or night time
function checkDayTime() {
    if(weather.iconId.includes('d')) {
        return true;
    } else {
        return false;
    }
}

// display weather to UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    feelslikeElement.innerHTML = `feels like ${weather.feelsTemp}°`;
    humidityElement.innerHTML = ` / humidity ${weather.relativeHumidity}`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;

    if(checkDayTime() === true) {
        container.style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 32%, rgb(163, 228, 255) 91%, rgb(120, 232, 255) 100%)';
    } else {
        container.style.background = 'linear-gradient(0deg, rgb(255, 255, 255) 32%, rgb(26 0 56) 91%, rgb(23 0 51) 100%)';
        appTitle.style.color = '#FFF';
    }
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