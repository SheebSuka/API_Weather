const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave API
const button = document.getElementById('getWeatherBtn');
const resultDiv = document.getElementById('weatherResult');

// Función para mostrar datos guardados en LocalStorage
function mostrarDatosGuardados() {
    const savedWeather = localStorage.getItem('weatherData');
    if (savedWeather) {
        const weather = JSON.parse(savedWeather); // Convierte el string JSON a objeto
        resultDiv.innerHTML += `<p>¡Bienvenido devuelta tu ciudad y temperatura era: ${weather.city} - ${weather.temperature}°C, ${weather.description}</p>`;
    }
}

// Maneja el clic en el botón
button.addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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

            // Muestra los resultados en el div correspondiente
            resultDiv.innerHTML = `<p>Temperatura en ${city}: ${temperature}°C</p><p>Descripción: ${weatherDescription}</p>`;

            // Guarda los datos en LocalStorage
            const weatherData = {
                city: city,
                temperature: temperature,
                description: weatherDescription
            };
            localStorage.setItem('weatherData', JSON.stringify(weatherData)); // Guarda como string JSON
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>${error.message}</p>`;
        });
});

// Maneja el clic en el botón para eliminar datos del LocalStorage
clearButton.addEventListener('click', () => {
    localStorage.removeItem('weatherData'); // Elimina el dato específico del LocalStorage
    resultDiv.innerHTML += `<p>Datos de clima eliminados.</p>`; // Mensaje de confirmación
});

// Muestra los datos guardados al cargar la página
window.onload = mostrarDatosGuardados;