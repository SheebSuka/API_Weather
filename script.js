const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513'; // Reemplaza con tu clave API
const button = document.getElementById('getWeatherBtn');
const addCityButton = document.getElementById('addCityBtn'); // Selecciona el botón para agregar ciudad
const clearButton = document.getElementById('clearStorageBtn');
const resultDiv = document.getElementById('weatherResult');
const defaultCitiesDiv = document.getElementById('defaultCities');

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
            const weatherData = { city, temperature, description: weatherDescription };
            localStorage.setItem('weatherData', JSON.stringify(weatherData));
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>${error.message}</p>`;
        });
});

// Maneja el clic en el botón para agregar una nueva ciudad
addCityButton.addEventListener('click', () => {
    const newCity = document.getElementById('cityInput').value; // Obtiene la ciudad ingresada

    if (newCity && !defaultCities.includes(newCity)) { // Verifica que no esté vacía y no esté ya en el array
        defaultCities.push(newCity); // Agrega la nueva ciudad al array

        // Guarda el array actualizado en LocalStorage
        localStorage.setItem('defaultCities', JSON.stringify(defaultCities));

        mostrarCiudadesPorDefecto(); // Muestra las ciudades actualizadas
        document.getElementById('cityInput').value = ''; // Limpia el campo de entrada
    } else if (defaultCities.includes(newCity)) {
        alert(`${newCity} ya está en la lista de ciudades.`);
    } else {
        alert("Por favor, ingresa un nombre de ciudad válido.");
    }
});

// Maneja el clic en el botón para eliminar datos del LocalStorage
clearButton.addEventListener('click', () => {
    localStorage.removeItem('weatherData');
    resultDiv.innerHTML += `<p>Datos de clima eliminados.</p>`;
});

// Muestra los datos guardados y las ciudades por defecto al cargar la página
window.onload = () => {
    mostrarDatosGuardados();
    mostrarCiudadesPorDefecto(); // Llama a la función para mostrar las ciudades por defecto y sus temperaturas
};