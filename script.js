const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave API
const button = document.getElementById('getWeatherBtn');
const clearButton = document.getElementById('clearStorageBtn');
const resultDiv = document.getElementById('weatherResult');
const defaultCitiesDiv = document.getElementById('defaultCities');
const cityForm = document.getElementById('cityForm'); // Selecciona el contenedor del formulario

// Inicializa el array de ciudades por defecto desde LocalStorage o usa un valor por defecto
let defaultCities = JSON.parse(localStorage.getItem('defaultCities')) || ['Madrid', 'Barcelona', 'Buenos Aires', 'Lima', 'Santiago'];

// Función para mostrar datos guardados en LocalStorage
function mostrarDatosGuardados() {
    const savedWeather = localStorage.getItem('weatherData');
    if (savedWeather) {
        const weather = JSON.parse(savedWeather);
        resultDiv.innerHTML += `<p>Último clima guardado: ${weather.city} - ${weather.temperature}°C, ${weather.description}</p>`;
    }
}

// Función para mostrar las ciudades por defecto y sus temperaturas
function mostrarCiudadesPorDefecto() {
    defaultCitiesDiv.innerHTML = ''; // Limpia la lista antes de mostrar
    const temperaturePromises = defaultCities.map(city => obtenerTemperatura(city)); // Obtiene las temperaturas

    Promise.all(temperaturePromises)
        .then(temperatures => {
            // Ordena las ciudades por temperatura de mayor a menor
            temperatures.sort((a, b) => b.temperature - a.temperature);
            temperatures.forEach(({ city, temperature, description }) => {
                const li = document.createElement('li');
                li.textContent = `${city}: ${temperature}°C, ${description}`;
                defaultCitiesDiv.appendChild(li);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

// Función para obtener la temperatura de una ciudad
function obtenerTemperatura(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener el clima de ${city}`);
            }
            return response.json();
        })
        .then(data => {
            const temperature = data.main.temp;
            const weatherDescription = data.weather[0].description;

            return { city, temperature, description: weatherDescription }; // Devuelve un objeto con los datos
        });
}

// Maneja el clic en el botón para obtener el clima
button.addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    
    if (!city) {
        alert("Por favor, ingresa una ciudad.");
        return;
    }

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
            resultDiv.innerHTML = `<p>¡Bienvenido! El clima de tu ciudad es: ${temperature}°C, ${weatherDescription}</p>`;
            
            // Guarda los datos en LocalStorage
            const weatherData = { city, temperature, description: weatherDescription };
            localStorage.setItem('weatherData', JSON.stringify(weatherData));

            // Oculta el formulario después de ingresar la ciudad
            cityForm.style.display = 'none';
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>${error.message}</p>`;
        });
});

// Maneja el clic en el botón para eliminar datos del LocalStorage y las ciudades por defecto
clearButton.addEventListener('click', () => {
    localStorage.removeItem('weatherData'); // Elimina los datos del clima guardados
    localStorage.removeItem('defaultCities'); // Elimina las ciudades por defecto guardadas

    // Reinicia el array de ciudades por defecto a un valor inicial
    defaultCities = ['Madrid', 'Barcelona', 'Buenos Aires', 'Lima', 'Santiago'];
    
    // Muestra un mensaje y actualiza la lista de ciudades por defecto
    resultDiv.innerHTML += `<p>Datos de clima y ciudades eliminados.</p>`;
    
    mostrarCiudadesPorDefecto(); // Muestra las ciudades iniciales

    // Muestra nuevamente el formulario
    cityForm.style.display = 'block';
});

// Muestra los datos guardados y las ciudades por defecto al cargar la página
window.onload = () => {
    mostrarDatosGuardados();
    mostrarCiudadesPorDefecto(); // Llama a la función para mostrar las ciudades por defecto y sus temperaturas
};