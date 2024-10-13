const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave API
const button = document.getElementById('getWeatherBtn');
const resultDiv = document.getElementById('weatherResult');

button.addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Realiza una solicitud a la API usando fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la consulta');
            }
            return response.json();
        })
        .then(data => {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;
            resultDiv.innerHTML = `<p>Temperatura en ${city}: ${temperature}°C</p><p>Descripción: ${weatherDescription}</p>`;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>${error.message}</p>`;
        });
});