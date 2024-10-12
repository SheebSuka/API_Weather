const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513';
const city = 'Texas';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const weatherDescription = data.weather[0].description;
        const city_name = data.name;
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        const cityNameElement = document.getElementById('city-name');
        const temperatureElement = document.getElementById('temperature');
        const humidityElement = document.getElementById('humidity');
        const weatherDescriptionElement = document.getElementById('weather-description');
        const weatherIconElement = document.getElementById('weather-icon');

        cityNameElement.textContent = city_name;
        temperatureElement.textContent = `Temperature: ${temperature}°C`;
        humidityElement.textContent = `Humidity: ${humidity}%`;
        weatherDescriptionElement.textContent = `Weather: ${weatherDescription}`;
        weatherIconElement.src = iconUrl;
    })
    .catch(error => console.error(error));
