const apiKey = '9b9a43120a8fe9f9a9edde94b15d8513';
const ciudadInput = document.getElementById('ciudad');
const botonBuscar = document.getElementById('buscar');
const resultado = document.getElementById('resultado');

botonBuscar.addEventListener('click', buscarCiudad);

function buscarCiudad() {
    const ciudad = ciudadInput.value.trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ciudad no existente');
            }
        })
        .then(data => {
            const temperatura = data.main.temp;
            const humedad = data.main.humidity;
            const descripcionClima = data.weather[0].description;
            const nombreCiudad = data.name;
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            resultado.innerHTML = `
        <h1>${nombreCiudad}</h1>
        <h2>Temperatura: ${temperatura}°C</h2>
        <p>Humedad: ${humedad}%</p>
        <p>Clima: ${descripcionClima}</p>
        <img src="${iconUrl}" alt="Icono del clima">
      `;
        })
        .catch(error => {
            resultado.innerHTML = `
        <h1>Ciudad no existente</h1>
        <p>Intenta nuevamente</p>
      `;
        });
}